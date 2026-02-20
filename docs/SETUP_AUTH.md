# Configuración de Auth y variables

## 1. Habilitar Email Auth en Supabase

Para que el login del panel funcione con Supabase Auth:

1. Entra al **Dashboard** de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto.
3. Ve a **Authentication** → **Providers** (menú lateral).
4. Haz clic en **Email**.
5. Activa el provider con el toggle **Enable Email provider**.
6. (Opcional) Configura **Confirm email** si quieres verificación por correo. Para desarrollo local, normalmente se deja desactivado.
7. Guarda los cambios.

## 2. Variables de entorno requeridas

| Variable | Dónde obtenerla | Uso |
|----------|-----------------|-----|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → **service_role** (secret) | Crear usuarios, bootstrap del primer admin |
| `UPSTASH_REDIS_REST_URL` | [Upstash Console](https://console.upstash.com) → Create Database | Rate limiting de login |
| `UPSTASH_REDIS_REST_TOKEN` | Misma base de datos en Upstash | Rate limiting de login |

Cópialas en `.env.local` (o en Vercel → Environment Variables para producción).

## 3. Migración 024 (RLS estricto)

Después de aplicar la migración `024_can_write_org_strict.sql`:

- **Escritura**: Solo usuarios admin de la org pueden crear/editar/eliminar.
- **Lectura**: Anónimos siguen pudiendo leer lo permitido por `can_read_org` (formularios públicos, etc.).

Aplica la migración con `supabase db push` o ejecutando el SQL en el **SQL Editor** del Dashboard.
