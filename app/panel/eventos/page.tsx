'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Camera,
  Globe,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
} from 'lucide-react'
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

  const [titulo, setTitulo] = useState('')
  const [link, setLink] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [fecha, setFecha] = useState('')
  const [horaInicio, setHoraInicio] = useState('17:00')
  const [horaFin, setHoraFin] = useState('18:00')
  const [ciudad, setCiudad] = useState('')
  const [orden, setOrden] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setImageFile(f)
      setImageUrl('')
      setImagePreview(URL.createObjectURL(f))
    }
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      setStatus({ type: 'error', message: 'Supabase no configurado.' })
      return
    }
    if (!link.trim()) {
      setStatus({ type: 'error', message: 'El enlace de registro es obligatorio.' })
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
          message: `No se pudo subir la imagen: ${uploadError.message}`,
        })
        setSaving(false)
        return
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)
      finalImageUrl = urlData.publicUrl
    }

    if (!finalImageUrl) {
      setStatus({ type: 'error', message: 'Sube una imagen o pega la URL.' })
      setSaving(false)
      return
    }

    setSaving(true)
    setStatus({ type: null, message: '' })
    const { error } = await supabase.from('eventos').insert({
      titulo: titulo.trim() || null,
      image_url: finalImageUrl,
      link: link.trim(),
      fecha: fecha.trim() || null,
      ciudad: ciudad.trim() || null,
      orden,
    })

    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Evento creado correctamente.' })
      setTitulo('')
      setLink('')
      setImageUrl('')
      setFecha('')
      setCiudad('')
      setImageFile(null)
      setImagePreview(null)
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

  const displayImage = imagePreview || imageUrl || null

  return (
    <div className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col w-full max-w-5xl mx-auto"
      >
        <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Crear evento</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda: imagen + tema */}
          <div className="lg:w-80 flex-shrink-0 space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 group">
              {displayImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-zinc-200 flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-sm">Agregar imagen</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="lg:hidden">
              <label className="block text-xs text-zinc-500 mb-1">o pega URL de imagen</label>
              <Input
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  if (imageFile) {
                    setImageFile(null)
                    setImagePreview(null)
                  }
                }}
                placeholder="https://..."
                className="rounded-xl bg-zinc-50 border-zinc-200"
              />
            </div>
          </div>

          {/* Columna derecha: formulario */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Nombre del evento */}
            <div>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Nombre del evento"
                className="text-lg font-medium rounded-xl bg-zinc-50 border-zinc-200 placeholder:text-zinc-400 h-12"
              />
            </div>

            {/* Fecha y hora */}
            <div className="flex flex-wrap gap-4 items-start">
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-3 h-3 rounded-full border-2 border-zinc-300" />
                  <div className="w-px flex-1 min-h-[60px] border-l-2 border-dashed border-zinc-200" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500">Inicio</p>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="rounded-xl bg-zinc-50 border-zinc-200 w-36"
                    />
                    <Input
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      className="rounded-xl bg-zinc-50 border-zinc-200 w-28"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-3 h-3 rounded-full border-2 border-zinc-300 border-dashed" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500">Fin</p>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="rounded-xl bg-zinc-50 border-zinc-200 w-36"
                    />
                    <Input
                      type="time"
                      value={horaFin}
                      onChange={(e) => setHoraFin(e.target.value)}
                      className="rounded-xl bg-zinc-50 border-zinc-200 w-28"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 text-zinc-600 text-sm">
                <Globe className="w-4 h-4" />
                <span>GMT-05:00</span>
                <span>Bogotá</span>
              </div>
            </div>

            {/* Ubicación */}
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
              <div className="flex items-center gap-2 text-zinc-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Agregar ubicación del evento</span>
              </div>
              <Input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ubicación física o enlace virtual"
                className="border-0 bg-transparent p-0 h-auto placeholder:text-zinc-400 focus-visible:ring-0"
              />
            </div>

            {/* Enlace / Descripción */}
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
              <div className="flex items-center gap-2 text-zinc-600 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Enlace de registro</span>
              </div>
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://luma.com/..."
                type="url"
                required
                className="border-0 bg-transparent p-0 h-auto placeholder:text-zinc-400 focus-visible:ring-0"
              />
            </div>

            {/** En desktop: URL de imagen */}
            <div className="hidden lg:block rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
              <div className="flex items-center gap-2 text-zinc-600 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">URL de imagen</span>
              </div>
              <Input
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  if (imageFile) {
                    setImageFile(null)
                    setImagePreview(null)
                  }
                }}
                placeholder="https://... o sube archivo a la izquierda"
                className="border-0 bg-transparent p-0 h-auto placeholder:text-zinc-400 focus-visible:ring-0"
              />
            </div>

            {/* Botón crear */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-6 rounded-xl bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-50 font-semibold text-base"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Crear evento'
              )}
            </Button>

            {status.type && (
              <div
                className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
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
          </div>
        </form>

        {/* Lista de eventos */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Eventos en la página</h2>
          {loading ? (
            <div className="flex gap-2 text-zinc-500 py-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              Cargando...
            </div>
          ) : eventos.length === 0 ? (
            <p className="text-zinc-500 py-8">No hay eventos. Crea uno arriba.</p>
          ) : (
            <ul className="space-y-4">
              {eventos.map((ev) => (
                <li
                  key={ev.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50/50"
                >
                  <div className="relative w-full sm:w-40 h-24 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
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
                    <p className="font-medium text-zinc-900 truncate">{ev.titulo || 'Sin título'}</p>
                    <a
                      href={ev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      {ev.link}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                    <p className="text-xs text-zinc-500 mt-1">
                      {ev.fecha ? `Fecha: ${ev.fecha}` : 'Sin fecha'}
                      {ev.ciudad ? ` · ${ev.ciudad}` : ''} · Orden: {ev.orden}
                    </p>
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
        </div>
      </motion.div>
    </div>
  )
}
