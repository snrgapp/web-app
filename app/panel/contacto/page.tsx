'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, User, MessageSquare, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/utils/supabase/client'
import type { Contacto } from '@/types/database.types'

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function PanelContactoPage() {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContactos() {
      if (!supabase) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('contactos')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setContactos(data ?? [])
      setLoading(false)
    }
    fetchContactos()
  }, [])

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
            CONTACTO
          </p>
          <h1 className="text-2xl sm:text-3xl font-hero text-black">Mensajes de contacto</h1>
          <p className="mt-2 text-zinc-500">
            Mensajes enviados desde el formulario &quot;Contáctanos&quot; en la página de inicio.
          </p>
        </div>

        <Card className="w-full overflow-hidden shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {loading ? (
              <div className="flex items-center gap-2 text-zinc-500 py-12 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando mensajes...
              </div>
            ) : contactos.length === 0 ? (
              <p className="text-zinc-500 py-12 text-center">No hay mensajes aún.</p>
            ) : (
              <ul className="space-y-5">
                {contactos.map((c) => (
                  <li key={c.id}>
                    <Card className="border border-zinc-200 bg-white overflow-hidden">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                            <span className="flex items-center gap-1.5">
                              <span className="text-zinc-400">{formatDate(c.created_at)}</span>
                            </span>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {c.nombre && (
                              <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Nombre
                                  </p>
                                  <p className="text-zinc-900">{c.nombre}</p>
                                </div>
                              </div>
                            )}
                            {c.correo && (
                              <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Correo
                                  </p>
                                  <a
                                    href={`mailto:${c.correo}`}
                                    className="text-zinc-900 hover:text-blue-600 hover:underline"
                                  >
                                    {c.correo}
                                  </a>
                                </div>
                              </div>
                            )}
                            {c.whatsapp && (
                              <div className="flex items-start gap-2 sm:col-span-2">
                                <Phone className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    WhatsApp
                                  </p>
                                  <a
                                    href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-900 hover:text-green-600 hover:underline"
                                  >
                                    {c.whatsapp}
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-start gap-2 border-t border-zinc-100 pt-4 mt-2">
                            <MessageSquare className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                                Mensaje
                              </p>
                              <p className="text-zinc-900 whitespace-pre-wrap break-words">
                                {c.mensaje}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
