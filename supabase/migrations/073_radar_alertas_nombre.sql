-- Nombre para Bird (first_name) y altas solo por correo.

ALTER TABLE public.radar_alertas
  ADD COLUMN IF NOT EXISTS nombre TEXT;

CREATE OR REPLACE FUNCTION public.upsert_radar_alerta(
  p_email text,
  p_telefono text,
  p_departamento text,
  p_canal text,
  p_nombre text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token uuid;
  v_email text;
  v_nombre text;
BEGIN
  v_email := nullif(lower(trim(coalesce(p_email, ''))), '');
  v_nombre := nullif(trim(coalesce(p_nombre, '')), '');

  IF v_email IS NOT NULL THEN
    SELECT unsubscribe_token INTO v_token
    FROM radar_alertas
    WHERE lower(email) = v_email AND active = true
    LIMIT 1;
    IF found THEN
      UPDATE radar_alertas
      SET nombre = coalesce(v_nombre, nombre)
      WHERE unsubscribe_token = v_token;
      RETURN v_token;
    END IF;
  END IF;

  INSERT INTO radar_alertas (email, telefono, departamento, canal, nombre, confirmed_at)
  VALUES (
    v_email,
    nullif(trim(coalesce(p_telefono, '')), ''),
    coalesce(nullif(trim(p_departamento), ''), 'bogota'),
    coalesce(nullif(trim(p_canal), ''), 'email'),
    v_nombre,
    CASE WHEN coalesce(p_canal, 'email') = 'whatsapp' THEN now() ELSE null END
  )
  RETURNING unsubscribe_token INTO v_token;

  RETURN v_token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_radar_alerta(text, text, text, text, text) TO anon, authenticated, service_role;
