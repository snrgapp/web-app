-- Rellenar ciudad en members a partir de asistentes + eventos (misma persona por teléfono)
-- Solo actualiza members que aún no tienen ciudad
WITH phone_match AS (
  SELECT DISTINCT ON (m.id) m.id, e.ciudad
  FROM members m
  JOIN asistentes a ON a.evento_id IS NOT NULL
    AND (
      a.telefono::text = m.phone::text
      OR REGEXP_REPLACE(COALESCE(a.telefono::text, ''), '\D', '', 'g') = REGEXP_REPLACE(COALESCE(m.phone::text, ''), '\D', '', 'g')
    )
  JOIN eventos e ON e.id = a.evento_id AND e.ciudad IS NOT NULL AND TRIM(e.ciudad) != ''
  WHERE m.ciudad IS NULL
  ORDER BY m.id, a.created_at DESC
)
UPDATE members SET ciudad = pm.ciudad, updated_at = now()
FROM phone_match pm
WHERE members.id = pm.id;
