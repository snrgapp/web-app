-- Clics de enlaces cortos (snrg.lat/reunion, etc.).
-- Lo escribe el middleware con service role; no hay insert público.

create table if not exists public.enlace_clicks (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  host text,
  destino text,
  referrer text,
  user_agent text,
  pais text,
  tipo text not null default 'visita'
    check (tipo in ('visita', 'preview', 'bot')),
  created_at timestamptz not null default now()
);

create index if not exists enlace_clicks_slug_created_idx
  on public.enlace_clicks (slug, created_at desc);

create index if not exists enlace_clicks_tipo_idx
  on public.enlace_clicks (tipo);

alter table public.enlace_clicks enable row level security;

drop policy if exists enlace_clicks_admin_select on public.enlace_clicks;
create policy enlace_clicks_admin_select on public.enlace_clicks
  for select using (auth.uid() is not null);

comment on table public.enlace_clicks is
  'Cada hit a un enlace corto. tipo=visita es un clic humano; preview/bot son crawlers al compartir el link.';
