-- Patrocinadores: [{ nombre, rol, logo_url, url }]
alter table public.eventos add column if not exists patrocinadores jsonb not null default '[]'::jsonb;

-- Qué incluye la entrada, se muestra bajo el valor en la tarjeta de registro
alter table public.eventos add column if not exists incluye text;
