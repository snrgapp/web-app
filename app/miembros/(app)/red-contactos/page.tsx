'use client'

import { LatestConnections } from '@/components/miembros/LatestConnections'
import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

interface MemberRow {
  id: string
  nombre: string
  email?: string
  empresa?: string
  phone?: string
}

export default function RedContactosPage() {
  const [latestConnections, setLatestConnections] = useState<
    { id: string; nombre: string; empresa: string; email?: string; phone?: string }[]
  >([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [openMembersModal, setOpenMembersModal] = useState(false)

  useEffect(() => {
    fetch('/api/miembros/connections')
      .then((r) => r.json())
      .then((data) => setLatestConnections(data.latestConnections || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/miembros/members')
      .then((r) => r.json())
      .then((data) => setMembers(data.members || []))
      .catch(() => setMembers([]))
      .finally(() => setLoadingMembers(false))
  }, [])

  const previewMembers = members.slice(0, 6)

  return (
    <>
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Red de contactos
          </p>
          <h1 className="text-2xl font-light text-black tracking-tight">
            Conecta con otros miembros
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-semibold text-zinc-700">Miembros</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpenMembersModal(true)}
                className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              >
                Ver tabla completa
              </button>
            </div>

            <div className="p-4">
              {loadingMembers ? (
                <div className="h-40 rounded-lg bg-zinc-100 animate-pulse" />
              ) : members.length === 0 ? (
                <p className="text-sm text-zinc-400">No hay miembros para mostrar</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200">
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Nombre</th>
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Email</th>
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Empresa</th>
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Teléfono</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewMembers.map((m) => (
                        <tr key={m.id} className="border-b border-zinc-100 last:border-0">
                          <td className="px-3 py-2 text-zinc-800">{m.nombre}</td>
                          <td className="px-3 py-2 text-zinc-600">{m.email || '-'}</td>
                          <td className="px-3 py-2 text-zinc-600">{m.empresa || '-'}</td>
                          <td className="px-3 py-2 text-zinc-600">{m.phone || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-800 mb-4">Tus conexiones</h2>
            {loading ? (
              <div className="h-48 rounded-xl border border-zinc-200 bg-white animate-pulse" />
            ) : (
              <LatestConnections connections={latestConnections} />
            )}
          </div>
        </div>
      </div>

      {openMembersModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm"
            onClick={() => setOpenMembersModal(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-4xl rounded-xl border border-zinc-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-zinc-800">Tabla de miembros</h3>
                <button
                  type="button"
                  onClick={() => setOpenMembersModal(false)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-4 max-h-[70vh] overflow-auto">
                <div className="overflow-x-auto rounded-lg border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200">
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Nombre</th>
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Email</th>
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Empresa</th>
                        <th className="text-left px-3 py-2 font-medium text-zinc-600">Teléfono</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="border-b border-zinc-100 last:border-0">
                          <td className="px-3 py-2 text-zinc-800">{m.nombre}</td>
                          <td className="px-3 py-2 text-zinc-600">{m.email || '-'}</td>
                          <td className="px-3 py-2 text-zinc-600">{m.empresa || '-'}</td>
                          <td className="px-3 py-2 text-zinc-600">{m.phone || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
