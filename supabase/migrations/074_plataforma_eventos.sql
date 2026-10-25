-- Plataforma de gestión de eventos (Synergy)

alter table public.eventos
  add column if not exists estado text not null default 'activo',
  add column if not exists formato text not null default 'presencial',
  add column if not exists capacidad integer,
  add column if not exists precio_cop integer not null default 0,
  add column if not exists hora_inicio text,
  add column if not exists hora_fin text,
  add column if not exists lugar text;

alter table public.asistentes
  add column if not exists checked_in_at timestamptz,
  add column if not exists estado_pago text not null default 'confirmado',
  add column if not exists origen_registro text not null default 'lista';

create table if not exists public.evento_form_campos (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references public.eventos(id) on delete cascade,
  organizacion_id uuid references public.organizaciones(id),
  label text not null,
  tipo text not null default 'texto',
  obligatorio boolean not null default false,
  opciones text,
  orden integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.evento_mensajes (
  id uuid primary key default gen_random_uuid(),
  organizacion_id uuid references public.organizaciones(id),
  evento_id uuid references public.eventos(id) on delete set null,
  canal text not null default 'email',
  asunto text,
  cuerpo text not null,
  destinatarios integer not null default 0,
  estado text not null default 'borrador',
  enviado_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.evento_ajustes (
  organizacion_id uuid primary key references public.organizaciones(id),
  mp_conectado boolean not null default false,
  mp_public_key text,
  notificar_email boolean not null default true,
  notificar_whatsapp boolean not null default false,
  whatsapp_pagos text,
  updated_at timestamptz default now()
);

create index if not exists evento_form_campos_evento_idx on public.evento_form_campos (evento_id);
create index if not exists evento_mensajes_org_idx on public.evento_mensajes (organizacion_id);

alter table public.evento_form_campos enable row level security;
alter table public.evento_mensajes enable row level security;
alter table public.evento_ajustes enable row level security;

drop policy if exists evento_form_campos_select on public.evento_form_campos;
drop policy if exists evento_form_campos_write on public.evento_form_campos;
create policy evento_form_campos_select on public.evento_form_campos
  for select using (can_read_org(auth.uid(), organizacion_id));
create policy evento_form_campos_write on public.evento_form_campos
  for all using (can_write_org(auth.uid(), organizacion_id))
  with check (can_write_org(auth.uid(), organizacion_id));

drop policy if exists evento_mensajes_select on public.evento_mensajes;
drop policy if exists evento_mensajes_write on public.evento_mensajes;
create policy evento_mensajes_select on public.evento_mensajes
  for select using (can_read_org(auth.uid(), organizacion_id));
create policy evento_mensajes_write on public.evento_mensajes
  for all using (can_write_org(auth.uid(), organizacion_id))
  with check (can_write_org(auth.uid(), organizacion_id));

drop policy if exists evento_ajustes_select on public.evento_ajustes;
drop policy if exists evento_ajustes_write on public.evento_ajustes;
create policy evento_ajustes_select on public.evento_ajustes
  for select using (can_read_org(auth.uid(), organizacion_id));
create policy evento_ajustes_write on public.evento_ajustes
  for all using (can_write_org(auth.uid(), organizacion_id))
  with check (can_write_org(auth.uid(), organizacion_id));
