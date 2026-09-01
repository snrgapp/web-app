'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  MoreVertical,
  Plus,
  Repeat,
  Trash2,
  UserPlus,
} from 'lucide-react'
import {
  AdminButton,
  Field,
  Modal,
  adminFetch,
  inputClass,
  useBusy,
} from '@/components/admin-miembros/admin-ui'
import {
  DUMMY_ADMIN_COFFEES,
  DUMMY_ADMIN_EVENTS,
  DUMMY_ADMIN_MEMBERS,
  DUMMY_ADMIN_PAIRINGS,
} from '@/lib/admin-miembros/coffee-dummy'
import { formatMeetDate, formatMeetTime } from '@/lib/miembros/coffee-meets'
import type { CmsDirectoryMember, CmsEvent, CmsGroupCoffee, CmsPairing } from '@/lib/cms/types'

const emptyCoffee = {
  titulo: '',
  anfitrion: '',
  tema: '',
  fecha: '',
  lugar: '',
  cupos: 6,
  member_ids: [] as string[],
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function isDummyId(id: string) {
  return id.startsWith('group-') || id.startsWith('event-') || id.startsWith('pair-') || id.startsWith('dummy-')
}

export default function AdminCoffeePage() {
  const [coffees, setCoffees] = useState<CmsGroupCoffee[]>(DUMMY_ADMIN_COFFEES)
  const [events, setEvents] = useState<CmsEvent[]>(DUMMY_ADMIN_EVENTS)
  const [pairings, setPairings] = useState<CmsPairing[]>(DUMMY_ADMIN_PAIRINGS)
  const [members, setMembers] = useState<CmsDirectoryMember[]>(DUMMY_ADMIN_MEMBERS)
  const [coffee, setCoffee] = useState<typeof emptyCoffee & { id?: string } | null>(null)
  const [eventDraft, setEventDraft] = useState({ titulo: '', fecha_inicio: '', asistentes: '50' })
  const [editingEvent, setEditingEvent] = useState<CmsEvent | null>(null)
  const { busy, error, setError, run } = useBusy()

  async function load() {
    try {
      const result = await adminFetch<{
        coffees: CmsGroupCoffee[]
        events: CmsEvent[]
        pairings: CmsPairing[]
        members: CmsDirectoryMember[]
      }>('/api/admin-miembros/coffee')
      setCoffees(result.coffees?.length ? result.coffees : DUMMY_ADMIN_COFFEES)
      setEvents(result.events?.length ? result.events : DUMMY_ADMIN_EVENTS)
      setPairings(result.pairings?.length ? result.pairings : DUMMY_ADMIN_PAIRINGS)
      setMembers(result.members?.length ? result.members : DUMMY_ADMIN_MEMBERS)
    } catch {
      setCoffees(DUMMY_ADMIN_COFFEES)
      setEvents(DUMMY_ADMIN_EVENTS)
      setPairings(DUMMY_ADMIN_PAIRINGS)
      setMembers(DUMMY_ADMIN_MEMBERS)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const visiblePairings = useMemo(() => pairings.slice(0, 6), [pairings])

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-8">
      <div>
        <h1 className="admin-display mb-2 text-members-on-surface">Coffee & Meets</h1>
        <p className="admin-editor-body text-members-on-surface-variant">
          Agenda y gestiona cafés grupales, emparejamientos automáticos y eventos de networking.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-members-outline-variant bg-members-surface-container-low px-3 py-2 text-sm text-members-on-surface-variant">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <section className="flex flex-col gap-6 rounded-xl border border-members-outline-variant bg-members-surface-container p-6">
            <div className="flex items-center justify-between border-b border-members-outline-variant pb-4">
              <div>
                <h1 className="admin-section-title text-members-on-surface">Grupos de Coffee</h1>
                <p className="admin-meta text-members-on-surface-variant">Crea mesas íntimas (máximo 6)</p>
              </div>
              <button
                type="button"
                onClick={() => setCoffee({ ...emptyCoffee })}
                className="admin-table-cell flex items-center gap-2 rounded-lg border border-members-outline-variant bg-members-surface-container-high px-4 py-2 text-members-on-surface transition-colors hover:bg-members-surface-container-highest"
              >
                <Plus className="h-4 w-4" />
                Nuevo grupo
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setCoffee({ ...emptyCoffee })}
                className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-members-outline-variant bg-members-surface-container-low text-members-on-surface-variant transition-colors hover:border-members-primary hover:text-members-primary"
              >
                <UserPlus className="h-8 w-8" />
                <span className="admin-table-cell">Elegir del directorio Synergy</span>
              </button>

              {coffees.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-members-outline-variant bg-members-surface-container-highest p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="admin-meta flex items-center gap-2 font-semibold text-members-primary">
                      <CalendarDays className="h-4 w-4" />
                      {formatMeetDate(item.fecha)} · {formatMeetTime(item.fecha)}
                    </div>
                    <span className="rounded bg-members-success/10 px-2 py-0.5 text-xs font-semibold text-members-success">
                      Programado
                    </span>
                  </div>
                  <h1 className="text-sm font-semibold text-members-on-surface">{item.titulo}</h1>
                  <div className="mt-1 flex -space-x-2 overflow-hidden">
                    {item.seats.slice(0, 3).map((seat) => (
                      <div
                        key={seat.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-members-primary-container text-[10px] font-semibold text-white ring-2 ring-members-surface-container-highest"
                        title={seat.nombre}
                      >
                        {initials(seat.nombre)}
                      </div>
                    ))}
                    {item.seats.length > 3 ? (
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-members-surface-container text-xs font-semibold text-members-on-surface ring-2 ring-members-surface-container-highest">
                        +{item.seats.length - 3}
                      </div>
                    ) : null}
                  </div>
                  <p className="admin-meta text-members-on-surface-variant">Tema: {item.tema}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-members-primary"
                      onClick={() =>
                        setCoffee({
                          ...item,
                          fecha: item.fecha?.slice(0, 16),
                          member_ids: item.seats.map((seat) => seat.member_id),
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-300"
                      onClick={() =>
                        void run(async () => {
                          if (isDummyId(item.id)) {
                            setCoffees((current) => current.filter((coffeeItem) => coffeeItem.id !== item.id))
                            return
                          }
                          await adminFetch('/api/admin-miembros/coffee', {
                            method: 'DELETE',
                            body: JSON.stringify({ id: item.id }),
                          })
                          await load()
                        })
                      }
                    >
                      Borrar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="flex flex-col rounded-xl border border-members-outline-variant bg-members-surface-container">
            <div className="flex items-center justify-between border-b border-members-outline-variant p-6">
              <div>
                <h1 className="admin-section-title text-members-on-surface">Encuentros 1:1</h1>
                <p className="admin-meta text-members-on-surface-variant">Emparejamientos automáticos de Synergy</p>
              </div>
              <span className="admin-table-cell flex items-center gap-1 text-members-primary">
                Ver todos <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="flex flex-col">
              {visiblePairings.map((item) => (
                <div
                  key={item.id}
                  className="flex h-14 items-center justify-between border-b border-members-outline-variant px-4 transition-colors last:border-b-0 hover:bg-members-surface-container-high"
                >
                  <div className="flex w-full items-center gap-6">
                    <Person name={item.requester_nombre} />
                    <Repeat className="h-4 w-4 shrink-0 text-members-outline" />
                    <Person name={item.target_nombre} />
                  </div>
                  <span
                    className={
                      item.status === 'confirmed'
                        ? 'admin-label-caps shrink-0 rounded bg-members-success/10 px-2 py-1 text-members-success'
                        : 'admin-label-caps shrink-0 rounded bg-members-pending/10 px-2 py-1 text-members-pending'
                    }
                  >
                    {item.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="flex h-full flex-col rounded-xl border border-members-outline-variant bg-members-surface-container p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="admin-section-title text-members-on-surface">Eventos de networking</h1>
            <button type="button" className="text-members-on-surface-variant hover:text-members-primary" aria-label="Más opciones">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <form
            className="mb-8 flex flex-col gap-4"
            onSubmit={(formEvent) => {
              formEvent.preventDefault()
              void run(async () => {
                if (!eventDraft.titulo || !eventDraft.fecha_inicio) {
                  setError('Nombre y fecha son obligatorios')
                  return
                }
                try {
                  await adminFetch('/api/admin-miembros/coffee', {
                    method: 'POST',
                    body: JSON.stringify({
                      kind: 'event',
                      titulo: eventDraft.titulo,
                      fecha_inicio: new Date(eventDraft.fecha_inicio).toISOString(),
                      asistentes: Number(eventDraft.asistentes) || 0,
                    }),
                  })
                  setEventDraft({ titulo: '', fecha_inicio: '', asistentes: '50' })
                  await load()
                } catch {
                  setEvents((current) => [
                    {
                      id: `event-local-${Date.now()}`,
                      titulo: eventDraft.titulo,
                      descripcion: '',
                      fecha_inicio: eventDraft.fecha_inicio,
                      ciudad: '',
                      lugar: '',
                      image_url: '',
                      link: '',
                      published: true,
                      asistentes: Number(eventDraft.asistentes) || 0,
                    },
                    ...current,
                  ])
                  setEventDraft({ titulo: '', fecha_inicio: '', asistentes: '50' })
                }
              })
            }}
          >
            <div>
              <label className="admin-label-caps mb-1 block text-members-on-surface-variant">Nombre del evento</label>
              <input
                className="admin-table-cell w-full rounded border border-members-outline-variant bg-members-surface-container-lowest p-2 text-members-on-surface outline-none focus:border-members-primary focus:ring-1 focus:ring-members-primary"
                placeholder="Ej. Mixer de founders Q3"
                value={eventDraft.titulo}
                onChange={(e) => setEventDraft({ ...eventDraft, titulo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label-caps mb-1 block text-members-on-surface-variant">Fecha</label>
                <input
                  type="date"
                  className="admin-date-input admin-table-cell w-full rounded border border-members-outline-variant bg-members-surface-container-lowest p-2 text-members-on-surface outline-none focus:border-members-primary"
                  value={eventDraft.fecha_inicio}
                  onChange={(e) => setEventDraft({ ...eventDraft, fecha_inicio: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-label-caps mb-1 block text-members-on-surface-variant">Cupo</label>
                <input
                  type="number"
                  className="admin-table-cell w-full rounded border border-members-outline-variant bg-members-surface-container-lowest p-2 text-members-on-surface outline-none focus:border-members-primary"
                  placeholder="50"
                  value={eventDraft.asistentes}
                  onChange={(e) => setEventDraft({ ...eventDraft, asistentes: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="admin-table-cell mt-2 w-full rounded-lg bg-members-primary-container py-2 font-semibold text-members-on-primary-container transition-colors hover:bg-[#3323cc]"
            >
              Crear evento
            </button>
          </form>

          <div className="mt-auto">
            <h1 className="admin-label-caps mb-3 border-b border-members-outline-variant pb-2 text-members-on-surface-variant">
              Próximos
            </h1>
            <div className="flex flex-col gap-3">
              {events.map((item) => (
                <div
                  key={item.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-members-outline-variant bg-members-surface-container-highest p-3 transition-colors hover:border-members-primary"
                  onClick={() => setEditingEvent(item)}
                >
                  <div>
                    <div className="admin-table-cell font-semibold text-members-on-surface">{item.titulo}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-members-on-surface-variant">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {item.fecha_inicio ? formatMeetDate(item.fecha_inicio) : 'Por confirmar'} · {item.asistentes} RSVP
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-members-on-surface-variant hover:text-red-300"
                    aria-label={`Borrar ${item.titulo}`}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation()
                      void run(async () => {
                        if (isDummyId(item.id)) {
                          setEvents((current) => current.filter((eventItem) => eventItem.id !== item.id))
                          return
                        }
                        await adminFetch('/api/admin-miembros/coffee', {
                          method: 'DELETE',
                          body: JSON.stringify({ id: item.id, kind: 'event' }),
                        })
                        await load()
                      })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {coffee ? (
        <Modal title={coffee.id ? 'Editar café grupal' : 'Nuevo café grupal'} onClose={() => setCoffee(null)}>
          <div className="grid gap-4">
            <Field label="Título">
              <input className={inputClass} value={coffee.titulo} onChange={(e) => setCoffee({ ...coffee, titulo: e.target.value })} />
            </Field>
            <Field label="Tema">
              <input className={inputClass} value={coffee.tema} onChange={(e) => setCoffee({ ...coffee, tema: e.target.value })} />
            </Field>
            <Field label="Anfitrión">
              <input className={inputClass} value={coffee.anfitrion} onChange={(e) => setCoffee({ ...coffee, anfitrion: e.target.value })} />
            </Field>
            <Field label="Fecha y hora">
              <input type="datetime-local" className={`${inputClass} admin-date-input`} value={coffee.fecha} onChange={(e) => setCoffee({ ...coffee, fecha: e.target.value })} />
            </Field>
            <Field label="Lugar">
              <input className={inputClass} value={coffee.lugar} onChange={(e) => setCoffee({ ...coffee, lugar: e.target.value })} />
            </Field>
            <Field label="Emprendedores del directorio (máx. 6)">
              <div className="max-h-48 overflow-y-auto rounded-lg border border-members-outline-variant p-3">
                {members.map((member) => {
                  const selected = (coffee.member_ids || []).includes(member.id)
                  return (
                    <label key={member.id} className="mb-2 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {
                          const current = coffee.member_ids || []
                          const next = selected
                            ? current.filter((id) => id !== member.id)
                            : current.length >= 6
                              ? current
                              : [...current, member.id]
                          setCoffee({ ...coffee, member_ids: next })
                        }}
                      />
                      {member.nombre} · {member.empresa || member.email}
                    </label>
                  )
                })}
              </div>
            </Field>
            <AdminButton
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  if (coffee.id && isDummyId(coffee.id)) {
                    setCoffees((current) =>
                      current.map((item) =>
                        item.id === coffee.id
                          ? {
                              ...item,
                              titulo: coffee.titulo,
                              tema: coffee.tema,
                              anfitrion: coffee.anfitrion,
                              fecha: coffee.fecha,
                              lugar: coffee.lugar,
                              seats: members
                                .filter((member) => coffee.member_ids.includes(member.id))
                                .map((member, index) => ({
                                  id: `${coffee.id}-seat-${index}`,
                                  coffee_id: coffee.id as string,
                                  member_id: member.id,
                                  status: 'invited' as const,
                                  nombre: member.nombre,
                                  empresa: member.empresa,
                                  email: member.email,
                                })),
                            }
                          : item
                      )
                    )
                    setCoffee(null)
                    return
                  }
                  await adminFetch('/api/admin-miembros/coffee', {
                    method: 'POST',
                    body: JSON.stringify({ ...coffee, fecha: new Date(coffee.fecha).toISOString() }),
                  })
                  setCoffee(null)
                  await load()
                })
              }
            >
              Guardar café
            </AdminButton>
          </div>
        </Modal>
      ) : null}

      {editingEvent ? (
        <Modal title="Editar evento" onClose={() => setEditingEvent(null)}>
          <div className="grid gap-4">
            <Field label="Título">
              <input className={inputClass} value={editingEvent.titulo} onChange={(e) => setEditingEvent({ ...editingEvent, titulo: e.target.value })} />
            </Field>
            <Field label="Ciudad">
              <input className={inputClass} value={editingEvent.ciudad} onChange={(e) => setEditingEvent({ ...editingEvent, ciudad: e.target.value })} />
            </Field>
            <AdminButton
              onClick={() => {
                setEvents((current) => current.map((item) => (item.id === editingEvent.id ? editingEvent : item)))
                setEditingEvent(null)
              }}
            >
              Guardar
            </AdminButton>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

function Person({ name }: { name: string }) {
  return (
    <div className="flex flex-1 items-center gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-members-primary-container text-[10px] font-semibold text-white">
        {initials(name)}
      </div>
      <span className="admin-table-cell text-members-on-surface">{name}</span>
    </div>
  )
}
