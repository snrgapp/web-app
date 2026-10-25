create table if not exists public.evento_pagos (
  id uuid primary key default gen_random_uuid(),
  organizacion_id uuid references public.organizaciones(id),
  evento_id uuid references public.eventos(id) on delete set null,
  asistente_id uuid references public.asistentes(id) on delete set null,
  pagador text,
  correo text,
  correo_origen_pago text,
  monto_cop integer not null default 0,
  estado text not null default 'pendiente',
  canal text not null default 'whatsapp',
  comprobante_url text,
  notas text,
  created_at timestamptz default now()
);

create index if not exists evento_pagos_org_idx on public.evento_pagos (organizacion_id);

alter table public.evento_pagos enable row level security;
