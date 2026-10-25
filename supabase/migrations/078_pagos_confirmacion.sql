-- Confirmación de pago por correo (Bird) y comprobantes privados

alter table public.evento_pagos
  add column if not exists confirmacion_enviada_at timestamptz,
  add column if not exists confirmacion_error text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'comprobantes',
  'comprobantes',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "comprobantes_select_auth" on storage.objects;
create policy "comprobantes_select_auth" on storage.objects
  for select to authenticated using (bucket_id = 'comprobantes');

drop policy if exists "comprobantes_insert_auth" on storage.objects;
create policy "comprobantes_insert_auth" on storage.objects
  for insert to authenticated with check (bucket_id = 'comprobantes');

drop policy if exists "comprobantes_delete_auth" on storage.objects;
create policy "comprobantes_delete_auth" on storage.objects
  for delete to authenticated using (bucket_id = 'comprobantes');
