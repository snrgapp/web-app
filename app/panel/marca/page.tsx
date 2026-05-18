'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Palette, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/utils/supabase/client'
import { useOrgId } from '@/components/panel/OrgProvider'
import { getOrgSettingsForBranding, updateOrgTheme } from '@/app/actions/org-branding'
import { DEFAULT_THEME, mergeTheme } from '@/lib/org-settings-schema'
import type { ThemeTokens } from '@/lib/org-settings-schema'
import Image from 'next/image'

const BUCKET = 'org-branding'

function hexToInput(hex: string | undefined): string {
  const h = hex ?? '#000000'
  if (/^#[0-9a-fA-F]{6}$/.test(h)) return h
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    return (
      '#' +
      h[1] +
      h[1] +
      h[2] +
      h[2] +
      h[3] +
      h[3]
    ).toLowerCase()
  }
  return '#000000'
}

export default function PanelMarcaPage() {
  const orgId = useOrgId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [theme, setTheme] = useState<ThemeTokens>({ ...DEFAULT_THEME })

  const load = useCallback(async () => {
    setLoading(true)
    const r = await getOrgSettingsForBranding()
    if (r.ok) {
      setTheme(mergeTheme(r.settings.theme, {}))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const r = await updateOrgTheme(theme)
    setSaving(false)
    if (r.ok) setMessage({ type: 'ok', text: 'Tema guardado.' })
    else setMessage({ type: 'err', text: r.error })
  }

  async function handleLogo(file: File) {
    if (!supabase || !orgId) {
      setMessage({ type: 'err', text: 'Sesión o organización no disponible.' })
      return
    }
    setUploading(true)
    setMessage(null)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `${orgId}/logo-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type,
    })
    if (upErr) {
      setUploading(false)
      setMessage({ type: 'err', text: upErr.message })
      return
    }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
    const url = pub.publicUrl
    const r = await updateOrgTheme({ logoUrl: url })
    setUploading(false)
    if (r.ok) {
      setTheme((t) => ({ ...t, logoUrl: url }))
      setMessage({ type: 'ok', text: 'Logo actualizado.' })
    } else setMessage({ type: 'err', text: r.error })
  }

  if (loading) {
    return (
      <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2">
        <div className="flex items-center justify-center py-24 text-zinc-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Cargando marca…
        </div>
      </div>
    )
  }

  const previewLogo = theme.logoUrl?.trim() || '/logo.png'

  return (
    <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col w-full max-w-6xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-2xl font-light text-black tracking-tight">Marca y tema</h1>
          <p className="text-sm text-zinc-500 mt-1">Colores, tipografía y logos para la experiencia pública de networking.</p>
        </div>

        {message && (
          <p
            className={`text-sm mx-0 ${message.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}
            role="status"
          >
            {message.text}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Palette className="w-4 h-4" />
              Tokens CSS
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-zinc-600 space-y-1">
                <span>Primario</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="h-9 w-12 rounded border border-zinc-200 cursor-pointer"
                    value={hexToInput(theme.primary)}
                    onChange={(e) => setTheme((t) => ({ ...t, primary: e.target.value }))}
                  />
                  <Input
                    value={theme.primary ?? ''}
                    onChange={(e) => setTheme((t) => ({ ...t, primary: e.target.value }))}
                    placeholder="#FFE100"
                    className="text-xs font-mono"
                  />
                </div>
              </label>
              <label className="text-xs text-zinc-600 space-y-1">
                <span>Acento (fondo oscuro)</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="h-9 w-12 rounded border border-zinc-200 cursor-pointer"
                    value={hexToInput(theme.accent)}
                    onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))}
                  />
                  <Input
                    value={theme.accent ?? ''}
                    onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))}
                    placeholder="#000000"
                    className="text-xs font-mono"
                  />
                </div>
              </label>
              <label className="text-xs text-zinc-600 space-y-1 col-span-2">
                <span>Fondo página</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="h-9 w-12 rounded border border-zinc-200 cursor-pointer"
                    value={hexToInput(theme.background)}
                    onChange={(e) => setTheme((t) => ({ ...t, background: e.target.value }))}
                  />
                  <Input
                    value={theme.background ?? ''}
                    onChange={(e) => setTheme((t) => ({ ...t, background: e.target.value }))}
                    className="text-xs font-mono"
                  />
                </div>
              </label>
            </div>

            <label className="text-xs text-zinc-600 block space-y-1">
              Fuente (stack CSS)
              <Input
                value={theme.fontSans ?? ''}
                onChange={(e) => setTheme((t) => ({ ...t, fontSans: e.target.value }))}
                placeholder="ui-sans-serif, system-ui, sans-serif"
                className="text-xs"
              />
            </label>

            <label className="text-xs text-zinc-600 block space-y-1">
              Radio de tarjetas (ej. 30px)
              <Input
                value={theme.cardRadius ?? ''}
                onChange={(e) => setTheme((t) => ({ ...t, cardRadius: e.target.value }))}
                className="text-xs font-mono"
              />
            </label>

            <label className="text-xs text-zinc-600 block space-y-1">
              URL del logo (opcional)
              <Input
                value={theme.logoUrl ?? ''}
                onChange={(e) => setTheme((t) => ({ ...t, logoUrl: e.target.value || null }))}
                placeholder="https://…"
                className="text-xs"
              />
            </label>

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando…
                </>
              ) : (
                'Guardar tema'
              )}
            </Button>
          </form>

          <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <ImagePlus className="w-4 h-4" />
              Logo
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) void handleLogo(f)
              }}
            />
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg border border-zinc-200 bg-white overflow-hidden flex items-center justify-center">
                <Image
                  src={previewLogo}
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain"
                  unoptimized={previewLogo.startsWith('http')}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading || !orgId}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? 'Subiendo…' : 'Subir imagen'}
              </Button>
            </div>
            <p className="text-[11px] text-zinc-500">
              Bucket <code className="font-mono bg-white px-1 rounded border">org-branding</code>. Ejecuta la migración{' '}
              <code className="font-mono">051_experience_templates_tenant_experiences.sql</code> en Supabase.
            </p>

            <div
              className="rounded-2xl p-6 space-y-2 mt-4 border border-zinc-200"
              style={{
                background: theme.background ?? DEFAULT_THEME.background,
                color: theme.foreground ?? DEFAULT_THEME.foreground,
                fontFamily: theme.fontSans ?? DEFAULT_THEME.fontSans,
              }}
            >
              <div
                className="h-16 rounded-xl flex items-center px-4 text-sm font-medium"
                style={{
                  background: theme.primary ?? DEFAULT_THEME.primary,
                  color: theme.primaryForeground ?? DEFAULT_THEME.primaryForeground,
                }}
              >
                Chip primario
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-full text-sm font-medium"
                style={{
                  background: theme.accent ?? DEFAULT_THEME.accent,
                  color: theme.accentForeground ?? DEFAULT_THEME.accentForeground,
                }}
              >
                Botón acento
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
