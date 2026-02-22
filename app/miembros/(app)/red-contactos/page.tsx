'use client'

import { LatestConnections } from '@/components/miembros/LatestConnections'
import { useState, useEffect } from 'react'
import { Users, UserRound, Building2, Mail, Phone, FolderOpen } from 'lucide-react'

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
  const [selectedMember, setSelectedMember] = useState<MemberRow | null>(null)

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

  return (
    <>
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Red de contactos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <div className="px-4 pb-4">
              {loadingMembers ? (
                <div className="h-40 rounded-lg bg-zinc-100 animate-pulse" />
              ) : members.length === 0 ? (
                <p className="text-xs text-zinc-400 pt-4">No hay miembros para mostrar</p>
              ) : (
                <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th className="text-left px-2 py-2 text-zinc-500"><UserRound className="w-3.5 h-3.5" /></th>
                        <th className="text-left px-2 py-2 text-zinc-500"><Building2 className="w-3.5 h-3.5" /></th>
                        <th className="text-left px-2 py-2 text-zinc-500"><Mail className="w-3.5 h-3.5" /></th>
                        <th className="text-left px-2 py-2 text-zinc-500"><Phone className="w-3.5 h-3.5" /></th>
                        <th className="text-right px-2 py-2 text-zinc-500"><FolderOpen className="w-3.5 h-3.5 inline" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="border-b border-zinc-100 last:border-0">
                          <td className="px-2 py-2 text-zinc-800">{m.nombre}</td>
                          <td className="px-2 py-2 text-zinc-600">{m.empresa || '-'}</td>
                          <td className="px-2 py-2 text-zinc-600">{m.email || '-'}</td>
                          <td className="px-2 py-2 text-zinc-600">{m.phone || '-'}</td>
                          <td className="px-2 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedMember(m)}
                              className="p-1 rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                              aria-label="Ver detalles del miembro"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                          </td>
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

      {selectedMember && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-800">Detalle del miembro</h3>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-zinc-800">
                  <UserRound className="w-4 h-4 text-zinc-500" />
                  <span>{selectedMember.nombre}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Building2 className="w-4 h-4 text-zinc-500" />
                  <span>{selectedMember.empresa || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span>{selectedMember.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Phone className="w-4 h-4 text-zinc-500" />
                  <span>{selectedMember.phone || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
