'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Founder } from '@/types/database.types'
import {
  getAllFounders,
  crearFounder,
  actualizarFounder,
  eliminarFounder,
} from '@/app/actions/spotlight'
import { supabase } from '@/utils/supabase/client'

interface FounderForm {
  nombre: string
  startup_nombre: string
  pitch_order: number
  image_url: string
}

const emptyForm: FounderForm = {
  nombre: '',
  startup_nombre: '',
  pitch_order: 0,
  image_url: '',
}

export default function FoundersAdminPage() {
  const [founders, setFounders] = useState<Founder[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FounderForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const loadFounders = useCallback(async () => {
    const data = await getAllFounders()
    setFounders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFounders()
  }, [loadFounders])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(f: Founder) {
    setForm({
      nombre: f.nombre,
      startup_nombre: f.startup_nombre,
      pitch_order: f.pitch_order,
      image_url: f.image_url ?? '',
    })
    setEditingId(f.id)
    setShowForm(true)
    setError('')
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !supabase) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('founders')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      setError('Error al subir imagen: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('founders')
      .getPublicUrl(fileName)

    setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }))
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (editingId) {
      const result = await actualizarFounder(editingId, {
        nombre: form.nombre,
        startup_nombre: form.startup_nombre,
        pitch_order: form.pitch_order,
        image_url: form.image_url || null,
      })
      if (!result.ok) {
        setError(result.error ?? 'Error al actualizar')
        setSaving(false)
        return
      }
    } else {
      const result = await crearFounder({
        nombre: form.nombre,
        startup_nombre: form.startup_nombre,
        pitch_order: form.pitch_order,
        image_url: form.image_url || undefined,
      })
      if (!result.ok) {
        setError(result.error ?? 'Error al crear')
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setShowForm(false)
    setEditingId(null)
    loadFounders()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este founder?')) return
    await eliminarFounder(id)
    loadFounders()
  }

  async function handleToggleActivo(f: Founder) {
    await actualizarFounder(f.id, { activo: !f.activo })
    loadFounders()
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link href="/panel/spotlight" className="p-1 rounded-lg hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">SPOTLIGHT</p>
            <h1 className="text-2xl font-black text-black">Founders</h1>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-black text-white hover:bg-zinc-800">
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </motion.div>

      {/* Formulario */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre del Founder</label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre de la Startup</label>
                    <input
                      type="text"
                      required
                      value={form.startup_nombre}
                      onChange={(e) => setForm((p) => ({ ...p, startup_nombre: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Orden de Pitch</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.pitch_order}
                      onChange={(e) => setForm((p) => ({ ...p, pitch_order: parseInt(e.target.value) || 0 }))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Foto</label>
                    <div className="flex items-center gap-2">
                      {form.image_url && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                          <Image src={form.image_url} alt="" width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="flex items-center gap-2 px-3 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 cursor-pointer transition-colors flex-1">
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {uploading ? 'Subiendo...' : 'Subir imagen'}
                        <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="gap-1">
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving} className="gap-1 bg-black text-white hover:bg-zinc-800">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editingId ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : founders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-zinc-500">No hay founders registrados.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="py-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">Orden</th>
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">Foto</th>
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">Nombre</th>
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">Startup</th>
                    <th className="text-center py-3 px-2 font-medium text-zinc-500">Activo</th>
                    <th className="text-right py-3 px-2 font-medium text-zinc-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {founders.map((f) => (
                    <tr key={f.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                      <td className="py-2 px-2 text-zinc-600">{f.pitch_order}</td>
                      <td className="py-2 px-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200">
                          {f.image_url ? (
                            <Image src={f.image_url} alt="" width={32} height={32} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                              {f.nombre.charAt(0)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 font-medium text-black">{f.nombre}</td>
                      <td className="py-2 px-2 text-zinc-600">{f.startup_nombre}</td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleToggleActivo(f)}
                          className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                            f.activo
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                          }`}
                        >
                          {f.activo ? 'Sí' : 'No'}
                        </button>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => openEdit(f)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(f.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
