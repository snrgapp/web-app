'use client'

import { useRef, useState } from 'react'
import {
  Brain,
  Handshake,
  Rocket,
  Send,
  UserRound,
  Wrench,
} from 'lucide-react'

type Prompt = {
  id: string
  label: string
  icon: typeof Rocket
  tone: 'secondary' | 'tertiary' | 'primary'
}

type Match = {
  id: string
  name: string
  role: string
  tags: string[]
  online?: boolean
}

type ChatMessage =
  | {
      id: string
      role: 'assistant'
      title?: string
      body: string
      prompts?: Prompt[]
      matches?: Match[]
    }
  | {
      id: string
      role: 'user'
      body: string
    }

const SUGGESTED_PROMPTS: Prompt[] = [
  { id: 'seed', label: 'Busco ronda seed', icon: Rocket, tone: 'secondary' },
  { id: 'saas', label: 'Alianzas B2B en SaaS', icon: Handshake, tone: 'tertiary' },
  { id: 'cto', label: 'Encontrar un co-founder técnico', icon: Wrench, tone: 'primary' },
]

const DUMMY_MATCHES: Match[] = [
  {
    id: 'diego',
    name: 'Diego R.',
    role: 'CEO, PayStream LatAm',
    tags: ['Fintech', 'B2B', 'Series A'],
    online: true,
  },
  {
    id: 'ana',
    name: 'Ana M.',
    role: 'CTO, FinCore',
    tags: ['Payments', 'LatAm'],
  },
  {
    id: 'camila',
    name: 'Camila V.',
    role: 'Founder, Norte Pay',
    tags: ['Fintech', 'Seed'],
    online: true,
  },
]

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'greet',
    role: 'assistant',
    title: '¿Cuál es el objetivo de tu próxima conexión?',
    body: 'Te ayudo a encontrar founders, inversionistas o mentores en la red Synergy según lo que estés construyendo ahora.',
    prompts: SUGGESTED_PROMPTS,
  },
  {
    id: 'user-1',
    role: 'user',
    body: 'Quiero conectar con founders de fintech que ya hayan escalado un producto de pagos B2B en LatAm.',
  },
  {
    id: 'ai-1',
    role: 'assistant',
    body: 'Perfecto. Encontré 3 founders en la red que encajan con eso. Esta es una selección curada:',
    matches: DUMMY_MATCHES,
  },
]

function iconTone(tone: Prompt['tone']) {
  if (tone === 'secondary') return 'text-members-secondary'
  if (tone === 'tertiary') return 'text-members-tertiary'
  return 'text-members-primary'
}

export function LetsConnectPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  function scrollToEnd() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  function sendDummy(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      body: trimmed,
    }
    const assistantMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      body: 'Esto es una vista previa. En el siguiente paso conectaremos el chat de IA para buscar matches reales en la red.',
      matches: DUMMY_MATCHES.slice(0, 2),
    }

    setMessages((current) => [...current, userMessage, assistantMessage])
    setDraft('')
    scrollToEnd()
  }

  return (
    <div className="relative flex h-[calc(100dvh-8rem)] flex-col md:h-[calc(100dvh-4rem)]">
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 pb-4 pt-6 sm:px-6 md:px-10 md:pt-10"
      >
        <div className="mx-auto w-full max-w-3xl space-y-8">
          {messages.map((message) =>
            message.role === 'user' ? (
              <div key={message.id} className="flex flex-row-reverse items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-members-outline-variant bg-members-surface-variant text-xs font-medium text-members-on-surface">
                  TÚ
                </div>
                <div className="flex flex-1 flex-col items-end">
                  <p className="mb-2 text-base font-medium text-members-on-surface">Tú</p>
                  <div className="max-w-[85%] rounded-xl rounded-tr-none bg-members-primary-container p-4 text-white">
                    <p className="text-sm leading-6 md:text-base">{message.body}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-members-outline-variant bg-members-surface-container-high">
                  <Brain className="h-5 w-5 text-members-primary" />
                </div>
                <div className="flex-1">
                  <p className="mb-2 text-base font-medium text-members-on-surface">
                    Asistente de conexiones
                  </p>
                  <div className="space-y-4 rounded-xl rounded-tl-none border border-members-outline-variant bg-members-surface-container-low p-4 shadow-lg md:p-6">
                    {message.title ? (
                      <h1 className="text-xl leading-7 text-members-on-surface md:text-2xl md:leading-8">
                        {message.title}
                      </h1>
                    ) : null}
                    <p className="text-sm leading-6 text-members-on-surface-variant md:text-base">
                      {message.body}
                    </p>
                    {message.prompts ? (
                      <div className="flex flex-wrap gap-2">
                        {message.prompts.map((prompt) => {
                          const Icon = prompt.icon
                          return (
                            <button
                              key={prompt.id}
                              type="button"
                              onClick={() => sendDummy(prompt.label)}
                              className="flex items-center gap-2 rounded-full border border-members-outline-variant bg-members-surface-variant px-3 py-1.5 text-left text-sm text-members-on-surface transition-colors hover:bg-members-surface-bright/40"
                            >
                              <Icon className={`h-4 w-4 ${iconTone(prompt.tone)}`} />
                              {prompt.label}
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                    {message.matches ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {message.matches.map((match) => (
                          <button
                            key={match.id}
                            type="button"
                            onClick={() => {
                              void fetch('/api/miembros/cms/pairings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ targetId: match.id }),
                              })
                            }}
                            className="group rounded-lg border border-members-outline-variant bg-members-surface p-4 text-left transition-colors hover:border-members-primary"
                          >
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-members-outline bg-members-surface-container-high">
                                  <UserRound className="h-5 w-5 text-members-on-surface-variant" />
                                </div>
                                <div>
                                  <h1 className="text-base font-medium text-members-on-surface transition-colors group-hover:text-members-primary">
                                    {match.name}
                                  </h1>
                                  <p className="text-xs tracking-wide text-members-on-surface-variant">
                                    {match.role}
                                  </p>
                                </div>
                              </div>
                              {match.online ? (
                                <div className="h-2 w-2 rounded-full bg-members-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
                              ) : null}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {match.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded bg-members-surface-variant px-2 py-1 text-[10px] text-members-on-surface-variant"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="shrink-0 bg-gradient-to-t from-members-background via-members-background to-transparent px-4 pb-3 pt-8 sm:px-6 md:px-10 md:pb-6">
        <form
          className="mx-auto w-full max-w-3xl"
          onSubmit={(event) => {
            event.preventDefault()
            sendDummy(draft)
          }}
        >
          <div className="relative rounded-2xl border border-members-outline-variant bg-members-surface-container-low shadow-[0_20px_40px_rgba(0,0,0,0.8)] focus-within:border-members-primary">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendDummy(draft)
                }
              }}
              rows={1}
              placeholder="¿Con quién quieres conectar?"
              className="min-h-14 w-full resize-none border-none bg-transparent p-4 pr-14 text-sm text-members-on-surface outline-none placeholder:text-members-outline md:text-base"
            />
            <button
              type="submit"
              className="absolute bottom-3 right-3 flex items-center justify-center rounded-xl bg-members-primary-container p-2 text-white transition-all hover:brightness-110"
              aria-label="Enviar"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs tracking-wide text-members-outline-variant">
            Matchmaking con IA. Vista previa con datos de ejemplo.
          </p>
        </form>
      </div>
    </div>
  )
}
