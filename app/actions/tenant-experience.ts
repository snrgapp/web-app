'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { setActiveTenantExperienceId } from '@/app/actions/org-branding'
import { parseOrgSettings } from '@/lib/org-settings-schema'
import type { ExperienceTemplate, Json } from '@/types/database.types'
import { absoluteUrl } from '@/lib/site'

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
  experience_form_id: string | null
  public_slug: string | null
  experience_templates: { key: string; label: string; base_path: string } | null
}

export async function listTenantExperiencesAction(): Promise<TenantExperienceRow[]> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return []
  const supabase = await createServerClient()
  if (!supabase) return []

  const { data: rows, error } = await supabase
    .from('tenant_experiences')
    .select(
      'id, status, created_at, template_id, evento_id, form_id, experience_form_id, public_slug'
    )
    .eq('organizacion_id', orgId)
    .order('created_at', { ascending: false })

  if (error || !rows?.length) return []

  const templateIds = [...new Set(rows.map((r) => r.template_id))]
  const { data: templates } = await supabase
    .from('experience_templates')
    .select('id, key, label, base_path')
    .in('id', templateIds)

  const byId = new Map((templates ?? []).map((t) => [t.id, t]))

  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    created_at: r.created_at,
    template_id: r.template_id,
    evento_id: r.evento_id,
    form_id: r.form_id,
    experience_form_id: r.experience_form_id,
    public_slug: r.public_slug,
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
      experienceFormId: string
      formSlug: string
      publicSlug: string
      expUrl: string
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
    .from('experience_forms')
    .select('id')
    .eq('organizacion_id', orgId)
    .eq('slug', slug)
    .maybeSingle()

  if (slugClash) return { ok: false, error: 'Ya existe un formulario PaaS con ese slug en tu organización.' }

  const { data: slugTe } = await supabase
    .from('tenant_experiences')
    .select('id')
    .eq('organizacion_id', orgId)
    .eq('public_slug', slug)
    .maybeSingle()

  if (slugTe) return { ok: false, error: 'Ya existe una experiencia con ese slug público.' }

  const { data: xform, error: xfErr } = await supabase
    .from('experience_forms')
    .insert({
      slug,
      titulo: title,
      descripcion: `Inscripción — ${template.label}`,
      organizacion_id: orgId,
      campos: [] as unknown as Json,
      activo: true,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (xfErr || !xform) {
    return { ok: false, error: xfErr?.message ?? 'No se pudo crear el formulario PaaS.' }
  }

  const { data: te, error: teErr } = await supabase
    .from('tenant_experiences')
    .insert({
      organizacion_id: orgId,
      template_id: template.id,
      experience_form_id: xform.id,
      public_slug: slug,
      evento_id: null,
      form_id: null,
      status: input.publish ? 'published' : 'draft',
      config: (template.default_modules ?? {}) as Json,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (teErr || !te) {
    await supabase.from('experience_forms').delete().eq('id', xform.id)
    return { ok: false, error: teErr?.message ?? 'No se pudo crear la experiencia.' }
  }

  if (input.publish) {
    await setActiveTenantExperienceId(te.id)
  }

  revalidatePath('/panel/plantillas')
  revalidatePath('/panel/exp-inscripciones')
  revalidatePath(`/inscripcion-exp/${slug}`)
  revalidatePath(`/exp/${slug}`)

  return {
    ok: true,
    tenantExperienceId: te.id,
    experienceFormId: xform.id,
    formSlug: slug,
    publicSlug: slug,
    expUrl: absoluteUrl(`/exp/${slug}`),
    inscripcionUrl: absoluteUrl(`/inscripcion-exp/${slug}`),
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
