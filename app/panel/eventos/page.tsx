'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  ImagePlus,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/utils/supabase/client'
import type { Evento } from '@/types/database.types'

const BUCKET = 'eventos'

export default function PanelEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  // Form state
  const [titulo, setTitulo] = useState('')
  const [link, setLink] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [orden, setOrden] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)

  async function fetchEventos() {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false })
    if (!error) setEventos(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchEventos()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      setStatus({ type: 'error', message: 'Supabase no configurado.' })
      return
    }
    if (!link.trim()) {
      setStatus({ type: 'error', message: 'El enlace es obligatorio.' })
      return
    }

    let finalImageUrl = imageUrl.trim()
    if (imageFile) {
      setSaving(true)
      setStatus({ type: null, message: '' })
      const ext = imageFile.name.split('.').pop() ?? 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, imageFile, { upsert: false })

      if (uploadError) {
        setStatus({
          type: 'error',
          message: `No se pudo subir la imagen. Crea el bucket "eventos" en Supabase Storage (público) o usa una URL de imagen: ${uploadError.message}`,
        })
        setSaving(false)
        return
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)
      finalImageUrl = urlData.publicUrl
    }

    if (!finalImageUrl) {
      setStatus({ type: 'error', message: 'Sube una imagen o pega la URL de la imagen.' })
      setSaving(false)
      return
    }

    setSaving(true)
    setStatus({ type: null, message: '' })
    const { error } = await supabase.from('eventos').insert({
      titulo: titulo.trim() || null,
      image_url: finalImageUrl,
      link: link.trim(),
      orden,
    })

    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Evento agregado. Se verá en la página /eventos.' })
      setTitulo('')
      setLink('')
      setImageUrl('')
      setImageFile(null)
      setOrden(eventos.length)
      fetchEventos()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!supabase || !confirm('¿Eliminar este evento?')) return
    const { error } = await supabase.from('eventos').delete().eq('id', id)
    if (!error) {
      setEventos((prev) => prev.filter((e) => e.id !== id))
      setStatus({ type: 'success', message: 'Evento eliminado.' })
    } else {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col w-full max-w-4xl mx-auto"
      >
        <div className="w-full mb-6">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            EVENTOS
          </p>
          <h1 className="text-2xl sm:text-3xl font-hero text-black">Eventos</h1>
          <p className="mt-2 text-zinc-500">
            Gestiona los eventos que se muestran en la página <strong>/eventos</strong>. Sube una
            imagen y el enlace de registro (ej. Luma); se mostrará como tarjeta clicable.
          </p>
        </div>

        <Card className="w-full mb-6 overflow-hidden shadow-sm border border-zinc-200">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Título (opcional)</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Reunión de Networking CTG"
                  className="max-w-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Enlace de registro <span className="text-red-500">*</span>
                </label>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://luma.com/niaonzz6"
                  type="url"
                  required
                  className="max-w-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Imagen de portada
                </label>
                <div className="flex flex-col gap-2 max-w-md">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) {
                          setImageFile(f)
                          setImageUrl('')
                        }
                        e.target.value = ''
                      }}
                      className="file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-zinc-100 file:text-zinc-700"
                    />
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <ImagePlus className="w-4 h-4" /> Subir a Storage
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">o pega la URL de la imagen:</span>
                  <Input
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      if (imageFile) setImageFile(null)
                    }}
                    placeholder="https://... o /images/eventos/portada.jpg"
                    type="text"
                    disabled={!!imageFile}
                  />
                  {imageFile && (
                    <p className="text-xs text-green-600">
                      Se subirá: {imageFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Orden</label>
                <Input
                  type="number"
                  min={0}
                  value={orden}
                  onChange={(e) => setOrden(Number(e.target.value) || 0)}
                  className="max-w-[120px]"
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="bg-pure-dark hover:bg-zinc-800 text-white gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Agregar evento'}
              </Button>
            </form>
            {status.type && (
              <div
                className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm ${
                  status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {status.message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full overflow-hidden shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Eventos en la página</h2>
            {loading ? (
              <div className="flex items-center gap-2 text-zinc-500 py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando...
              </div>
            ) : eventos.length === 0 ? (
              <p className="text-zinc-500 py-8">No hay eventos. Agrega uno arriba.</p>
            ) : (
              <ul className="space-y-4">
                {eventos.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-zinc-200 bg-zinc-50/50"
                  >
                    <div className="relative w-full sm:w-40 h-24 rounded-md overflow-hidden bg-zinc-200 flex-shrink-0">
                      {ev.image_url.startsWith('/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ev.image_url}
                          alt={ev.titulo ?? ''}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ev.image_url}
                          alt={ev.titulo ?? ''}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 truncate">
                        {ev.titulo || 'Sin título'}
                      </p>
                      <a
                        href={ev.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        {ev.link}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                      <p className="text-xs text-zinc-500 mt-1">Orden: {ev.orden}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(ev.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
