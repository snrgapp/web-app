-- La key pública (anon) viaja en el navegador. Con ella nadie debe poder leer
-- ni modificar datos personales: esas lecturas las hace el servidor con la
-- service role, y el panel entra con sesión de un miembro de la organización.

-- Asistentes
drop policy if exists "Allow public update on asistentes" on public.asistentes;

drop policy if exists asistentes_select on public.asistentes;
create policy asistentes_select on public.asistentes for select using (
  auth.uid() is not null
  and can_read_org(auth.uid(), (select e.organizacion_id from public.eventos e where e.id = asistentes.evento_id))
);

drop policy if exists asistentes_update on public.asistentes;
create policy asistentes_update on public.asistentes for update
  using (can_write_org(auth.uid(), (select e.organizacion_id from public.eventos e where e.id = asistentes.evento_id)) and auth.uid() is not null)
  with check (can_write_org(auth.uid(), (select e.organizacion_id from public.eventos e where e.id = asistentes.evento_id)) and auth.uid() is not null);

-- Tablas con datos personales o de pagos: lectura solo con sesión
drop policy if exists contactos_select on public.contactos;
create policy contactos_select on public.contactos for select
  using (auth.uid() is not null and can_read_org(auth.uid(), organizacion_id));

drop policy if exists leads_select on public.leads;
create policy leads_select on public.leads for select
  using (auth.uid() is not null and can_read_org(auth.uid(), organizacion_id));

drop policy if exists lista_espera_ciudades_select on public.lista_espera_ciudades;
create policy lista_espera_ciudades_select on public.lista_espera_ciudades for select
  using (auth.uid() is not null and can_read_org(auth.uid(), organizacion_id));

drop policy if exists evento_pagos_select on public.evento_pagos;
create policy evento_pagos_select on public.evento_pagos for select
  using (auth.uid() is not null and can_read_org(auth.uid(), organizacion_id));

drop policy if exists evento_mensajes_select on public.evento_mensajes;
create policy evento_mensajes_select on public.evento_mensajes for select
  using (auth.uid() is not null and can_read_org(auth.uid(), organizacion_id));

drop policy if exists feedback_networking_select on public.feedback_networking;
create policy feedback_networking_select on public.feedback_networking for select using (
  auth.uid() is not null
  and can_read_org(auth.uid(), (
    select e.organizacion_id from public.asistentes a join public.eventos e on e.id = a.evento_id
    where a.id = feedback_networking.asistente_id
  ))
);

drop policy if exists form_submissions_select on public.form_submissions;
create policy form_submissions_select on public.form_submissions for select using (
  auth.uid() is not null
  and can_read_org(auth.uid(), (select f.organizacion_id from public.forms f where f.id = form_submissions.form_id))
);

drop policy if exists experience_form_submissions_select on public.experience_form_submissions;
create policy experience_form_submissions_select on public.experience_form_submissions for select using (
  auth.uid() is not null
  and can_read_org(auth.uid(), (
    select f.organizacion_id from public.experience_forms f where f.id = experience_form_submissions.experience_form_id
  ))
);

-- Área de miembros: todo pasa por el servidor con service role
drop policy if exists members_select_public on public.members;
drop policy if exists members_insert_public on public.members;
drop policy if exists members_update_public on public.members;

drop policy if exists connections_select_public on public.connections;
drop policy if exists connections_insert_public on public.connections;
drop policy if exists connections_update_public on public.connections;

drop policy if exists event_attendance_select_public on public.event_attendance;
drop policy if exists event_attendance_insert_public on public.event_attendance;
drop policy if exists event_attendance_delete_public on public.event_attendance;

drop policy if exists member_events_select_public on public.member_events;
drop policy if exists member_events_insert_public on public.member_events;
drop policy if exists member_events_update_public on public.member_events;

-- Miembros de la organización: sin sesión no se puede leer, añadir ni quitar a nadie
drop policy if exists organizacion_miembros_select on public.organizacion_miembros;
create policy organizacion_miembros_select on public.organizacion_miembros for select
  using (user_id = auth.uid() or is_org_admin(auth.uid(), organizacion_id));

drop policy if exists organizacion_miembros_insert on public.organizacion_miembros;
create policy organizacion_miembros_insert on public.organizacion_miembros for insert
  with check (is_org_admin(auth.uid(), organizacion_id));

drop policy if exists organizacion_miembros_delete on public.organizacion_miembros;
create policy organizacion_miembros_delete on public.organizacion_miembros for delete
  using (is_org_admin(auth.uid(), organizacion_id) or user_id = auth.uid());
