-- Facturación mensual del cuestionario de reuniones.

alter table public.reunion_registros
  add column if not exists facturacion text;
