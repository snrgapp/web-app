-- Respuestas a las preguntas del formulario del evento (evento_form_campos), por etiqueta

alter table public.asistentes
  add column if not exists respuestas jsonb not null default '{}'::jsonb;
