-- Columnas que necesita el panel de eventos (diseño Stitch) para ser editable.

alter table public.evento_mensajes
  add column if not exists titulo text,
  add column if not exists tipo text not null default 'envio',
  add column if not exists disparador text,
  add column if not exists activo boolean not null default true,
  add column if not exists programado_at timestamptz,
  add column if not exists enviados integer not null default 0,
  add column if not exists fallidos integer not null default 0,
  add column if not exists error text;

alter table public.evento_pagos
  add column if not exists referencia text,
  add column if not exists entradas integer not null default 1,
  add column if not exists concepto text;

alter table public.asistentes
  add column if not exists cargo text,
  add column if not exists tipo_ticket text,
  add column if not exists genero text,
  add column if not exists rango_edad text,
  add column if not exists tamano_equipo text,
  add column if not exists antiguedad text,
  add column if not exists formalizada boolean;

alter table public.eventos
  add column if not exists agenda jsonb not null default '[]'::jsonb,
  add column if not exists lista_espera boolean not null default false;

alter table public.evento_ajustes
  add column if not exists politica_reembolso text,
  add column if not exists cuenta_dispersion text,
  add column if not exists dia_dispersion text;
