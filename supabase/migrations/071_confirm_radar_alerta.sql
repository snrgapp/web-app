-- Cierra el ciclo de confirmación aunque el visitante no tenga sesión.

CREATE OR REPLACE FUNCTION public.confirm_radar_alerta(p_token uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_id uuid;
  already timestamptz;
BEGIN
  SELECT id, confirmed_at INTO row_id, already
  FROM radar_alertas
  WHERE unsubscribe_token = p_token;

  IF row_id IS NULL THEN
    RETURN 'missing';
  END IF;
  IF already IS NOT NULL THEN
    RETURN 'already';
  END IF;

  UPDATE radar_alertas
  SET confirmed_at = now(), active = true
  WHERE id = row_id;

  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_radar_alerta(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_radar_alerta(uuid) TO anon, authenticated, service_role;
