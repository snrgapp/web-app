# Cómo agregar preguntas en Supabase

Tienes **dos categorías** en la app:

| Categoría en la app | Slug en la BD | Tipo de preguntas |
|---------------------|---------------|-------------------|
| **MEET A NEW FRIEND** (tarjeta negra) | `founder` | Conocer al founder |
| **LET'S CONNECT** (tarjeta amarilla) | `company` | Desafíos de la empresa |

Cada pregunta debe estar asociada a **una categoría** (`category_id`). Así, cuando el usuario elige una tarjeta, solo se muestran preguntas de esa categoría.

---

## Opción 1: Desde el Table Editor de Supabase (interfaz)

1. Entra en [supabase.com](https://supabase.com) → tu proyecto.
2. Menú **Table Editor**.
3. Abre la tabla **`categories`** y anota los **id** de:
   - **Conocer al founder** (slug `founder`)
   - **Desafíos de la empresa** (slug `company`)
4. Abre la tabla **`questions`**.
5. Clic en **Insert row** y rellena:
   - **content**: el texto de la pregunta (ej: *¿Cuál ha sido la lección más valiosa que aprendiste en el último error que cometiste?*).
   - **category_id**: el UUID de la categoría (el que anotaste en el paso 3).
   - **difficulty_level**: `easy`, `medium` o `hard` (puedes usar cualquiera).
6. Guarda. Repite para cada pregunta nueva.

---

## Opción 2: Con SQL en el SQL Editor

1. En Supabase: **SQL Editor** → **New query**.
2. Pega y adapta este ejemplo (cambia el texto y el slug según la categoría):

```sql
-- Pregunta para "Conocer al founder" (tarjeta MEET A NEW FRIEND)
INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Tu pregunta aquí para el founder?',
  id,
  'medium'
FROM categories 
WHERE slug = 'founder' 
LIMIT 1;

-- Pregunta para "Desafíos de la empresa" (tarjeta LET'S CONNECT)
INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Tu pregunta aquí sobre la empresa?',
  id,
  'easy'
FROM categories 
WHERE slug = 'company' 
LIMIT 1;
```

3. Sustituye el texto entre comillas por tu pregunta.
4. Ejecuta la consulta (**Run**).

Para **varias preguntas**, repite el bloque `INSERT INTO questions ... SELECT ... FROM categories WHERE slug = '...'` por cada una (o usa varios `INSERT` en la misma query).

---

## Resumen

- **founder** = preguntas para conocer al founder (tarjeta negra).
- **company** = preguntas sobre desafíos de la empresa (tarjeta amarilla).
- Cada pregunta debe tener un **content**, un **category_id** (vía slug `founder` o `company`) y un **difficulty_level** (`easy` / `medium` / `hard`).

Si ya tienes un listado en un documento o hoja de cálculo, puedes copiar cada pregunta en el Table Editor o en los `INSERT` del SQL Editor como en los ejemplos de arriba.
