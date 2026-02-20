# Diseño de Organizaciones y RLS Multi-Tenant

Este documento describe el esquema de organizaciones y las políticas RLS implementadas para soportar una plataforma community-as-a-service.

## Resumen del diseño

- **organizaciones**: Tenant principal. Cada comunidad es una organización independiente.
- **organizacion_miembros**: Vincula usuarios (Supabase Auth) con organizaciones y roles.
- Todas las tablas de datos tienen `organizacion_id` o lo heredan vía FK.

## Esquema de tablas

### Nueva: `organizaciones`

| Columna        | Tipo   | Descripción                                              |
|----------------|--------|----------------------------------------------------------|
| id             | UUID   | PK                                                       |
| nombre         | TEXT   | Nombre de la comunidad                                   |
| slug           | TEXT   | Identificador URL (ej: `snrg`, `acme`). Único global.   |
| dominio_custom | TEXT   | Opcional: `comunidad.ejemplo.com`                        |
| plan           | TEXT   | `free` \| `pro` \| `enterprise`                         |
| settings       | JSONB  | Config flexible: branding, brevo_list_id default, etc.   |
| created_at     | TIMESTAMPTZ |                                             |
| updated_at     | TIMESTAMPTZ |                                             |

### Nueva: `organizacion_miembros`

| Columna         | Tipo   | Descripción                          |
|-----------------|--------|--------------------------------------|
| id              | UUID   | PK                                   |
| organizacion_id | UUID   | FK → organizaciones                  |
| user_id         | UUID   | Referencia a `auth.users.id` (cuando Auth esté activo) |
| rol             | TEXT   | `admin` \| `member` \| `viewer`      |
| created_at      | TIMESTAMPTZ |                            |

### Tablas modificadas (añadido `organizacion_id`)

| Tabla              | Relación con org                  |
|--------------------|-----------------------------------|
| eventos            | Directa                           |
| forms              | Directa (forms pueden ser standalone) |
| categories         | Directa (networking)              |
| leads              | Directa                           |
| contactos          | Directa                           |
| founders           | Directa (Spotlight)               |
| votantes           | Directa (Spotlight)               |
| asistentes         | Vía evento                         |
| form_submissions   | Vía form                          |
| feedback_networking | Vía asistente → evento           |
| questions          | Vía category                      |
| votos              | Vía votante + founder             |

### Unicidad por organización

- **eventos.checkin_slug**: Único por `(organizacion_id, checkin_slug)`
- **forms.slug**: Único por `(organizacion_id, slug)`
- **votantes.whatsapp**: Único por `(organizacion_id, whatsapp)`
- **categories.name**: Único por `(organizacion_id, name)`
- **categories.slug**: Único por `(organizacion_id, slug)`
- **leads.email**: Único por `(organizacion_id, email)`

## RLS: estrategia y funciones

### Funciones auxiliares

```sql
is_org_member(p_user_id, p_org_id)  → boolean
is_org_admin(p_user_id, p_org_id)   → boolean
can_read_org(p_user_id, p_org_id)   → boolean  -- anon O miembro
can_write_org(p_user_id, p_org_id)  → boolean  -- solo admin (desde migración 024)
```

### Comportamiento sin sesión (post-migración 024)

- `auth.uid()` es `null` para peticiones anónimas.
- `can_read_org(null, org_id)` → `true` (anon puede leer formularios públicos, etc.)
- `can_write_org(null, org_id)` → `false` (anon no puede escribir; requiere login)

### Comportamiento con Supabase Auth activo

- Usuarios autenticados tienen `auth.uid()` definido.
- `can_read_org(uid, org_id)` → `true` solo si el usuario es miembro de esa org.
- `can_write_org(uid, org_id)` → `true` solo si el usuario es admin de esa org.

**Resultado**: Cada usuario solo ve y edita datos de las organizaciones donde tiene permiso.

### Políticas por tipo de tabla

| Tabla              | SELECT                     | INSERT                  | UPDATE/DELETE             |
|--------------------|----------------------------|-------------------------|---------------------------|
| eventos            | can_read_org               | can_write_org           | can_write_org             |
| forms              | can_read_org               | can_write_org           | can_write_org             |
| form_submissions   | can_read_org (vía form)    | EXISTS(form activo)     | —                         |
| asistentes         | can_read_org (vía evento)   | can_write_org           | can_write_org             |
| feedback_networking| can_read_org (vía asistente→evento) | true (público) | —                         |
| categories         | can_read_org               | can_write_org           | can_write_org             |
| questions          | can_read_org (vía category) | can_write_org          | can_write_org             |
| leads              | can_read_org               | true                    | —                         |
| contactos          | can_read_org               | true                    | —                         |
| founders           | can_read_org               | can_write_org           | can_write_org             |
| votantes           | can_read_org               | can_write_org           | can_write_org             |
| votos              | can_read_org               | true                    | —                         |

## Cómo aplicar las migraciones

### Opción 1: Supabase Dashboard (SQL Editor)

1. Ir a **SQL Editor** en tu proyecto Supabase.
2. Ejecutar en orden:
   - `021_organizaciones.sql`
   - `022_organizacion_id_tablas.sql`
   - `023_rls_multi_tenant.sql`

### Opción 2: Supabase CLI

```bash
# Instalar Supabase CLI si no lo tienes
npm i -g supabase

# Enlazar proyecto
supabase link --project-ref <tu-project-ref>

# Aplicar migraciones
supabase db push
```

### Verificación post-migración

```sql
-- Debe existir la org default
SELECT * FROM organizaciones WHERE slug = 'snrg';

-- Todas las tablas deben tener organizacion_id poblado (excepto NULL legacy)
SELECT 'eventos' AS tbl, COUNT(*) FROM eventos WHERE organizacion_id IS NULL
UNION ALL
SELECT 'forms', COUNT(*) FROM forms WHERE organizacion_id IS NULL;
-- etc.
```

## Migración del código de la aplicación

### 1. Resolver organización actual

Para multi-tenant por dominio/subdominio:

```typescript
// lib/org-resolver.ts (ejemplo)
export function getOrgSlugFromHost(host: string): string | null {
  // app.snrg.snrg.lat → snrg
  // app.acme.snrg.lat → acme
  const match = host.match(/^app\.(\w+)\./);
  return match ? match[1] : 'snrg'; // default
}
```

Para el panel (cuando haya Auth):

```typescript
// El usuario autenticado tiene orgs en organizacion_miembros
const { data: memberships } = await supabase
  .from('organizacion_miembros')
  .select('organizacion_id, organizacion:organizaciones(slug)')
  .eq('user_id', user.id);
```

### 2. Filtrar queries por organización

Todas las consultas del panel deben incluir el filtro:

```typescript
const orgId = await getCurrentOrgId(); // de dominio, sesión, etc.
const { data } = await supabase
  .from('eventos')
  .select('*')
  .eq('organizacion_id', orgId);
```

### 3. Crear registros con organizacion_id

Al insertar eventos, forms, etc.:

```typescript
await supabase.from('eventos').insert({
  ...eventoData,
  organizacion_id: orgId,
});
```

### 4. Formularios y leads públicos

Para inscripción y contacto, hay que asignar la org según el contexto:

- Por dominio: resolver org desde el host de la request.
- Por defecto: usar la org principal (`slug = 'snrg'`) hasta implementar multi-dominio.

```typescript
// En submitFormAction o similar
const orgId = await resolveOrgFromRequest(); // host, cookie, etc.
await supabase.from('form_submissions').insert({
  form_id,
  datos,
  // form ya tiene organizacion_id implícito
});
```

## Estado actual (completado)

1. ~~**Supabase Auth**~~: Login migrado a Supabase Auth.
2. ~~**organizacion_miembros**~~: Bootstrap del primer admin al iniciar sesión.
3. ~~**Resolver org en middleware**~~: Middleware establece `x-org-slug` según el host; `lib/org-resolver.ts` resuelve org desde headers Host o `x-org-slug` (app.acme.snrg.lat → acme).
4. ~~**Panel**~~: Todas las páginas del panel filtran por `organizacion_id` (via `getDefaultOrgId` / `useOrgId`).
5. ~~**Eliminar fallback anon**~~: Migración 024; `can_write_org` ya no permite escritura anónima.

## Referencia de migraciones

| Archivo  | Contenido                                   |
|----------|---------------------------------------------|
| 021      | Tabla organizaciones, organizacion_miembros  |
| 022      | organizacion_id en tablas, backfill, uniques|
| 023      | Funciones RLS y políticas por tabla         |
| 024      | can_write_org estricto (sin fallback anon)  |

Véase también [SETUP_AUTH.md](./SETUP_AUTH.md) para habilitar Email Auth y variables.
