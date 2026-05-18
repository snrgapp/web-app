'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { setActiveTenantExperienceId } from '@/app/actions/org-branding'
import { parseOrgSettings } from '@/lib/org-settings-schema'
import type { FormFieldConfig } from '@/types/form.types'
import type { ExperienceTemplate, Json } from '@/types/database.types'
import { absoluteUrl } from '@/lib/site'

function parseFormPreset(raw: unknown): FormFieldConfig[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (c): c is FormFieldConfig =>
      typeof c === 'object' &&
      c !== null &&
      typeof (c as FormFieldConfig).key === 'string' &&
      typeof (c as FormFieldConfig).label === 'string' &&
      typeof (c as FormFieldConfig).type === 'string'
  )
}

function normalizeSlug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export async function listExperienceTemplatesAction(): Promise<ExperienceTemplate[]> {
  const supabase = await createServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('experience_templates')
    .select('*')
    .order('label', { ascending: true })

  if (error || !data) return []
  return data as ExperienceTemplate[]
}

export type TenantExperienceRow = {
  id: string
  status: string
  created_at: string
  template_id: string
  evento_id: string | null
  form_id: string | null
  form_slug: string | null
  experience_templates: { key: string; label: string; base_path: string } | null
}

export async function listTenantExperiencesAction(): Promise<TenantExperienceRow[]> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return []
  const supabase = await createServerClient()
  if (!supabase) return []

  const { data: rows, error } = await supabase
    .from('tenant_experiences')
    .select('id, status, created_at, template_id, evento_id, form_id')
    .eq('organizacion_id', orgId)
    .order('created_at', { ascending: false })

  if (error || !rows?.length) return []

  const templateIds = [...new Set(rows.map((r) => r.template_id))]
  const { data: templates } = await supabase
    .from('experience_templates')
    .select('id, key, label, base_path')
    .in('id', templateIds)

  const byId = new Map((templates ?? []).map((t) => [t.id, t]))

  const formIds = [...new Set(rows.map((r) => r.form_id).filter(Boolean))] as string[]
  let slugByFormId = new Map<string, string>()
  if (formIds.length > 0) {
    const { data: forms } = await supabase.from('forms').select('id, slug').in('id', formIds)
    slugByFormId = new Map((forms ?? []).map((f) => [f.id, f.slug]))
  }

  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    created_at: r.created_at,
    template_id: r.template_id,
    evento_id: r.evento_id,
    form_id: r.form_id,
    form_slug: r.form_id ? (slugByFormId.get(r.form_id) ?? null) : null,
    experience_templates: byId.get(r.template_id) ?? null,
  }))
}

export type ProvisionInput = {
  templateId: string
  eventTitle: string
  formSlug: string
  publish: boolean
}

export type ProvisionResult =
  | {
      ok: true
      tenantExperienceId: string
      eventoId: string
      formId: string
      formSlug: string
      basePath: string
      inscripcionUrl: string
    }
  | { ok: false; error: string }

export async function provisionTenantExperienceAction(input: ProvisionInput): Promise<ProvisionResult> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return { ok: false, error: 'No se pudo resolver la organización.' }

  const supabase = await createServerClient()
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' }

  const slug = normalizeSlug(input.formSlug)
  if (!slug) return { ok: false, error: 'El slug del formulario es obligatorio (letras, números y guiones).' }

  const title = input.eventTitle.trim()
  if (!title) return { ok: false, error: 'El nombre del evento es obligatorio.' }

  const { data: template, error: tErr } = await supabase
    .from('experience_templates')
    .select('*')
    .eq('id', input.templateId)
    .maybeSingle()

  if (tErr || !template) return { ok: false, error: 'Plantilla no encontrada.' }

  const { data: slugClash } = await supabase
    .from('forms')
    .select('id')
    .eq('organizacion_id', orgId)
    .eq('slug', slug)
    .maybeSingle()

  if (slugClash) return { ok: false, error: 'Ya existe un formulario con ese slug en tu organización.' }

  const campos = parseFormPreset(template.default_form_preset)

  const { data: evento, error: eErr } = await supabase
    .from('eventos')
    .insert({
      titulo: title,
      image_url: '/logo.png',
      link: null,
      orden: 0,
      organizacion_id: orgId,
      checkin_slug: slug,
      inscripcion_abierta: true,
    })
    .select('id')
    .single()

  if (eErr || !evento) {
    return { ok: false, error: eErr?.message ?? 'No se pudo crear el evento.' }
  }

  const { data: form, error: fErr } = await supabase
    .from('forms')
    .insert({
      slug,
      titulo: title,
      descripcion: `Inscripción — ${template.label}`,
      organizacion_id: orgId,
      evento_id: evento.id,
      campos: campos as unknown as Json,
      activo: true,
    })
    .select('id')
    .single()

  if (fErr || !form) {
    await supabase.from('eventos').delete().eq('id', evento.id)
    return { ok: false, error: fErr?.message ?? 'No se pudo crear el formulario.' }
  }

  const { data: te, error: teErr } = await supabase
    .from('tenant_experiences')
    .insert({
      organizacion_id: orgId,
      template_id: template.id,
      evento_id: evento.id,
      form_id: form.id,
      status: input.publish ? 'published' : 'draft',
      config: (template.default_modules ?? {}) as Json,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (teErr || !te) {
    await supabase.from('forms').delete().eq('id', form.id)
    await supabase.from('eventos').delete().eq('id', evento.id)
    return { ok: false, error: teErr?.message ?? 'No se pudo crear la experiencia.' }
  }

  if (input.publish) {
    await setActiveTenantExperienceId(te.id)
  }

  revalidatePath('/panel/plantillas')
  revalidatePath('/panel/eventos')
  revalidatePath('/panel/formularios')

  const basePath = String(template.base_path ?? '/networking')
  return {
    ok: true,
    tenantExperienceId: te.id,
    eventoId: evento.id,
    formId: form.id,
    formSlug: slug,
    basePath,
    inscripcionUrl: absoluteUrl(`/inscripcion/${slug}`),
  }
}

export async function updateTenantExperienceStatusAction(
  id: string,
  status: 'draft' | 'published' | 'archived'
): Promise<{ ok: true } | { ok: false; error: string }> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return { ok: false, error: 'No se pudo resolver la organización.' }

  const supabase = await createServerClient()
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' }

  const { error } = await supabase
    .from('tenant_experiences')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('organizacion_id', orgId)

  if (error) return { ok: false, error: error.message }

  if (status === 'published') {
    await setActiveTenantExperienceId(id)
  } else {
    const { data: orgRow } = await supabase
      .from('organizaciones')
      .select('settings')
      .eq('id', orgId)
      .single()
    const s = parseOrgSettings(orgRow?.settings)
    if (s.experience?.activeTenantExperienceId === id) {
      await setActiveTenantExperienceId(null)
    }
  }

  revalidatePath('/panel/plantillas')
  return { ok: true }
}
