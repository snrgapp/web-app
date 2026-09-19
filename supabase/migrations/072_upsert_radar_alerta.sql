-- Inscribe o reutiliza el token, y marca el envío de confirmación sin pelear con RLS.

CREATE OR REPLACE FUNCTION public.upsert_radar_alerta(
  p_email text,
  p_telefono text,
  p_departamento text,
  p_canal text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token uuid;
  v_email text;
BEGIN
  v_email := nullif(lower(trim(coalesce(p_email, ''))), '');

  IF v_email IS NOT NULL THEN
    SELECT unsubscribe_token INTO v_token
    FROM radar_alertas
    WHERE lower(email) = v_email AND active = true
    LIMIT 1;
    IF found THEN
      RETURN v_token;
    END IF;
  END IF;

  INSERT INTO radar_alertas (email, telefono, departamento, canal, confirmed_at)
  VALUES (
    v_email,
    nullif(trim(coalesce(p_telefono, '')), ''),
    coalesce(nullif(trim(p_departamento), ''), 'bogota'),
    coalesce(nullif(trim(p_canal), ''), 'email'),
    CASE WHEN coalesce(p_canal, 'email') = 'whatsapp' THEN now() ELSE null END
  )
  RETURNING unsubscribe_token INTO v_token;

  RETURN v_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_radar_confirmation_sent(p_token uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE radar_alertas
  SET confirmation_sent_at = now()
  WHERE unsubscribe_token = p_token;
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_radar_alerta(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_radar_alerta(text, text, text, text) TO anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.mark_radar_confirmation_sent(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_radar_confirmation_sent(uuid) TO anon, authenticated, service_role;
