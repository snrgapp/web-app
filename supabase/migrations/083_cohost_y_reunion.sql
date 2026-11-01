-- Co-host con usuario Auth y registros del cuestionario de reuniones.

alter table public.evento_staff
  add column if not exists user_id uuid;

create unique index if not exists evento_staff_user_id_uidx
  on public.evento_staff (user_id)
  where user_id is not null;

create table if not exists public.reunion_registros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  correo text not null,
  telefono text,
  ciudad text not null,
  empresa text,
  instagram text,
  problema text,
  tiempo_empresa text,
  tamano_equipo text,
  canales text[] not null default '{}',
  camara_comercio text,
  desafio text,
  acepto_terminos boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists reunion_registros_correo_uidx
  on public.reunion_registros (lower(correo));

create index if not exists reunion_registros_ciudad_idx
  on public.reunion_registros (ciudad);

alter table public.reunion_registros enable row level security;

drop policy if exists reunion_registros_admin_select on public.reunion_registros;
create policy reunion_registros_admin_select on public.reunion_registros
  for select using (auth.uid() is not null);
