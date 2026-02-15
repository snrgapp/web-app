'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Votante } from '@/types/database.types'
import {
  getVotantes,
  crearVotante,
  actualizarVotante,
  eliminarVotante,
} from '@/app/actions/spotlight'
import Papa from 'papaparse'

interface VotanteForm {
  nombre: string
  whatsapp: string
  categoria: 'espectador' | 'jurado'
}

const emptyForm: VotanteForm = {
  nombre: '',
  whatsapp: '',
  categoria: 'espectador',
}

export default function VotantesAdminPage() {
  const [votantes, setVotantes] = useState<Votante[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<VotanteForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [csvLoading, setCsvLoading] = useState(false)
  const [csvResult, setCsvResult] = useState('')

  const loadVotantes = useCallback(async () => {
    const data = await getVotantes()
    setVotantes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadVotantes()
  }, [loadVotantes])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(v: Votante) {
    setForm({
      nombre: v.nombre ?? '',
      whatsapp: v.whatsapp,
      categoria: v.categoria,
    })
    setEditingId(v.id)
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (editingId) {
      const result = await actualizarVotante(editingId, {
        nombre: form.nombre || undefined,
        whatsapp: form.whatsapp,
        categoria: form.categoria,
      })
      if (!result.ok) {
        setError(result.error ?? 'Error al actualizar')
        setSaving(false)
        return
      }
    } else {
      const result = await crearVotante({
        whatsapp: form.whatsapp,
        nombre: form.nombre || undefined,
        categoria: form.categoria,
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
    loadVotantes()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este votante?')) return
    await eliminarVotante(id)
    loadVotantes()
  }

  function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvLoading(true)
    setCsvResult('')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as Record<string, string>[]
        let created = 0
        let errores = 0

        for (const row of rows) {
          const whatsapp = row.whatsapp || row.telefono || row.phone || ''
          const nombre = row.nombre || row.name || ''
          const categoria = (row.categoria || 'espectador').toLowerCase() as 'espectador' | 'jurado'

          if (!whatsapp.trim()) {
            errores++
            continue
          }

          const result = await crearVotante({
            whatsapp: whatsapp.trim(),
            nombre: nombre.trim() || undefined,
            categoria: categoria === 'jurado' ? 'jurado' : 'espectador',
          })

          if (result.ok) created++
          else errores++
        }

        setCsvResult(`Importados: ${created} | Errores/duplicados: ${errores}`)
        setCsvLoading(false)
        loadVotantes()
      },
      error: () => {
        setCsvResult('Error al leer el archivo CSV')
        setCsvLoading(false)
      },
    })

    // Reset input
    e.target.value = ''
  }

  const jurados = votantes.filter((v) => v.categoria === 'jurado').length
  const espectadores = votantes.filter((v) => v.categoria === 'espectador').length

  return (
    <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Link href="/panel/spotlight" className="p-1 rounded-lg hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">SPOTLIGHT</p>
            <h1 className="text-2xl font-light text-black tracking-tight">Votantes</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-3 h-9 rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 cursor-pointer transition-colors">
            {csvLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Importar CSV
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" disabled={csvLoading} />
          </label>
          <Button onClick={openCreate} className="gap-2 bg-black text-white hover:bg-zinc-800">
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="px-3 py-1 bg-zinc-100 rounded-full text-zinc-600">
          Total: <strong>{votantes.length}</strong>
        </span>
        <span className="px-3 py-1 bg-amber-50 rounded-full text-amber-700">
          Jurados: <strong>{jurados}</strong>
        </span>
        <span className="px-3 py-1 bg-blue-50 rounded-full text-blue-700">
          Espectadores: <strong>{espectadores}</strong>
        </span>
      </div>

      {csvResult && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg"
        >
          {csvResult}
        </motion.p>
      )}

      {/* Formulario */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                      placeholder="3001234567"
                      className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Categoría</label>
                    <select
                      value={form.categoria}
                      onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value as 'espectador' | 'jurado' }))}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    >
                      <option value="espectador">Espectador</option>
                      <option value="jurado">Jurado</option>
                    </select>
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
      ) : votantes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-zinc-500">No hay votantes registrados.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="py-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">WhatsApp</th>
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">Nombre</th>
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">Categoría</th>
                    <th className="text-left py-3 px-2 font-medium text-zinc-500">Registrado</th>
                    <th className="text-right py-3 px-2 font-medium text-zinc-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {votantes.map((v) => (
                    <tr key={v.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                      <td className="py-2 px-2 font-mono text-zinc-700">{v.whatsapp}</td>
                      <td className="py-2 px-2 font-medium text-black">{v.nombre ?? '—'}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            v.categoria === 'jurado'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {v.categoria}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-zinc-500 text-xs">
                        {new Date(v.created_at).toLocaleDateString('es-CO')}
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => openEdit(v)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(v.id)}
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
