-- Staff por evento (co-hosts distintos según ciudad) y pases QR por asistente.

alter table public.asistentes
  add column if not exists ticket_token text,
  add column if not exists pase_enviado_at timestamptz;

update public.asistentes
  set ticket_token = encode(gen_random_bytes(16), 'hex')
  where ticket_token is null;

alter table public.asistentes
  alter column ticket_token set default encode(gen_random_bytes(16), 'hex');

create unique index if not exists asistentes_ticket_token_uidx
  on public.asistentes (ticket_token);

alter table public.eventos
  add column if not exists pase_recordatorio boolean not null default true;

create table if not exists public.evento_staff (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references public.eventos(id) on delete cascade,
  organizacion_id uuid not null references public.organizaciones(id),
  email text not null,
  nombre text,
  rol text not null default 'puerta',
  invite_token text not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);

create unique index if not exists evento_staff_evento_email_uidx
  on public.evento_staff (evento_id, lower(email));

create unique index if not exists evento_staff_invite_token_uidx
  on public.evento_staff (invite_token);

create index if not exists evento_staff_org_idx
  on public.evento_staff (organizacion_id);

alter table public.evento_staff enable row level security;

drop policy if exists evento_staff_select on public.evento_staff;
drop policy if exists evento_staff_write on public.evento_staff;

create policy evento_staff_select on public.evento_staff
  for select using (can_read_org(auth.uid(), organizacion_id) and auth.uid() is not null);

create policy evento_staff_write on public.evento_staff
  for all using (can_write_org(auth.uid(), organizacion_id) and auth.uid() is not null)
  with check (can_write_org(auth.uid(), organizacion_id) and auth.uid() is not null);
