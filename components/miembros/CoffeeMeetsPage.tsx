'use client'

import { useEffect, useState } from 'react'
import {
  Calendar,
  Clock,
  Coffee,
  MapPin,
  PartyPopper,
  Users,
} from 'lucide-react'
import {
  DUMMY_EVENTS,
  DUMMY_GROUP_COFFEES,
  DUMMY_ONE_TO_ONES,
  formatEventWhen,
  formatMeetDate,
  formatMeetTime,
  type GroupCoffee,
  type NetworkingEvent,
  type OneToOneMeet,
} from '@/lib/miembros/coffee-meets'
import { mapCmsEvent, mapCmsGroup } from '@/lib/cms/mappers'

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function cardClassName() {
  return 'flex flex-col gap-4 rounded-2xl border border-[#262626] bg-[#121212] p-6 transition-all duration-200 hover:border-[#333333] hover:bg-[#1a1a1a]'
}

export function CoffeeMeetsPage() {
  const [joined, setJoined] = useState<string[]>([])
  const [ones, setOnes] = useState<OneToOneMeet[]>(DUMMY_ONE_TO_ONES)
  const [groups, setGroups] = useState<(GroupCoffee & { invited?: boolean; confirmed?: boolean })[]>(
    DUMMY_GROUP_COFFEES
  )
  const [events, setEvents] = useState<NetworkingEvent[]>(DUMMY_EVENTS)
  const [usingCms, setUsingCms] = useState(false)

  useEffect(() => {
    fetch('/api/miembros/cms/coffee')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!payload) return
        const hasCms = Boolean(payload.groups?.length || payload.events?.length || payload.ones?.length)
        if (!hasCms) return
        setUsingCms(true)
        if (payload.ones?.length) setOnes(payload.ones)
        if (payload.groups?.length) {
          setGroups(payload.groups.map(mapCmsGroup))
          setJoined(
            payload.groups
              .filter((group: { confirmed?: boolean }) => group.confirmed)
              .map((group: { id: string }) => group.id)
          )
        }
        if (payload.events?.length) setEvents(payload.events.map(mapCmsEvent))
      })
      .catch(() => undefined)
  }, [])

  async function joinCoffee(id: string) {
    const response = await fetch('/api/miembros/cms/coffee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coffeeId: id }),
    })
    if (response.ok) setJoined((current) => [...current, id])
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-10">
      <div className="mb-8 md:mb-10">
        <h1 className="coffee-title mb-2 text-members-on-surface">Coffee & Meets</h1>
        <p className="beneficios-subtitle text-members-on-surface-variant">
          Conecta con founders, súmate a cafés grupales o llega a los eventos de networking.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-6 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-members-on-surface">
              <Coffee className="h-5 w-5 text-members-primary" />
              Encuentros 1:1
            </h1>
            <span className="text-xs font-semibold tracking-wide text-members-primary">
              {ones.length} en total
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ones.map((meet) => (
              <article key={meet.id} className={cardClassName()}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#262626] bg-members-primary-container text-sm font-semibold text-white">
                      {initials(meet.nombre)}
                    </div>
                    <div>
                      <h1 className="text-base font-semibold text-members-on-surface">
                        {meet.nombre}
                      </h1>
                      <p className="text-xs tracking-wide text-members-on-surface-variant">
                        {meet.rol} · {meet.empresa}
                      </p>
                    </div>
                  </div>
                  <div className="rounded bg-members-surface-bright px-2 py-1 text-[10px] font-semibold tracking-wider text-[#ffdbcc]">
                    {meet.estado === 'aceptado' ? 'ACEPTADO' : 'PRÓXIMO'}
                  </div>
                </div>
                <div className="h-px w-full bg-[#262626]" />
                <div className="flex items-center justify-between text-members-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatMeetDate(meet.fecha)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatMeetTime(meet.fecha)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 lg:col-span-4">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-members-on-surface">
            <Users className="h-5 w-5 text-members-secondary" />
            Coffee grupales
          </h1>
          <div className="flex flex-col gap-4">
            {groups.map((group) => {
              const isJoined = joined.includes(group.id) || group.confirmed
              return (
                <article key={group.id} className={cardClassName() + ' relative overflow-hidden'}>
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-bl-full bg-members-secondary/5" />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-base font-semibold text-members-on-surface">
                        {group.titulo}
                      </h1>
                      <p className="mt-1 text-xs text-members-on-surface-variant">
                        {group.tema}
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-members-surface-bright px-2 py-1 text-[10px] font-semibold tracking-wider text-members-secondary">
                      {group.ocupados}/{group.cupos}
                    </span>
                  </div>
                  <p className="relative z-10 text-xs text-members-on-surface-variant">
                    Anfitrión: {group.anfitrion}
                  </p>
                  <div className="relative z-10 flex flex-col gap-2 text-members-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {formatMeetDate(group.fecha)} · {formatMeetTime(group.fecha)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{group.lugar}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={Boolean(usingCms && group.invited === false)}
                    onClick={() => (usingCms ? void joinCoffee(group.id) : setJoined((current) => [...current, group.id]))}
                    className={
                      isJoined
                        ? 'relative z-10 rounded-lg bg-members-success py-2 text-xs font-semibold text-white'
                        : 'relative z-10 rounded-lg bg-members-primary-container py-2 text-xs font-semibold text-white transition-colors hover:brightness-110'
                    }
                  >
                    {isJoined ? 'Confirmaste tu asistencia' : usingCms && group.invited === false ? 'Solo por invitación' : 'Unirme'}
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-2 flex flex-col gap-6 lg:col-span-12 lg:mt-8">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-members-on-surface">
            <PartyPopper className="h-5 w-5 text-members-tertiary" />
            Eventos de networking
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {events.map((event) => (
              <a
                key={event.id}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[200px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#262626] bg-[#121212] transition-all duration-200 hover:border-[#333333] hover:bg-[#1a1a1a] md:flex-row"
              >
                <div className="relative h-48 w-full overflow-hidden md:h-auto md:w-2/5">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:hidden" />
                  <div className="absolute inset-0 z-10 hidden bg-gradient-to-l from-[#121212] via-transparent to-transparent md:block" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="z-20 flex w-full flex-col justify-between p-6 md:w-3/5">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h1 className="text-xl font-semibold leading-7 text-members-on-surface">
                        {event.titulo}
                      </h1>
                      <div className="flex shrink-0 items-center gap-1 rounded border border-[#333333] bg-[#1a1a1a] px-2 py-1 text-members-tertiary">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-semibold">{event.asistentes}</span>
                      </div>
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm text-members-on-surface-variant">
                      {event.descripcion}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 border-t border-[#262626] pt-4 text-members-on-surface-variant sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatEventWhen(event.fecha)}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{event.ciudad}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
