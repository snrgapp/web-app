'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ShelfScene, buildShelfCatalog } from './ShelfScene'
import { layoutBooksOnShelf } from '@/lib/recursos/shelf-catalog'
import { COMPLETE_SHELF_MANIFEST } from '@/lib/recursos/mint-manifest'

const MARKERS = 5

export function CompleteShelf() {
  const books = useMemo(() => buildShelfCatalog(), [])
  const { positions, totalWidth } = useMemo(
    () => layoutBooksOnShelf(books),
    [books]
  )
  const maxOffset = totalWidth / 2 - 1.2

  const [shelfOffset, setShelfOffset] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [inspecting, setInspecting] = useState(false)
  const drag = useRef<{ active: boolean; x: number; offset: number }>({
    active: false,
    x: 0,
    offset: 0,
  })

  const clampOffset = useCallback(
    (v: number) => Math.max(-maxOffset, Math.min(maxOffset, v)),
    [maxOffset]
  )

  const selectedBook = selectedId
    ? books.find((b) => b.id === selectedId) ?? null
    : null

  const handleSelect = (id: string) => {
    if (inspecting && selectedId === id) return
    setSelectedId(id)
    setInspecting(true)
    const idx = books.findIndex((b) => b.id === id)
    if (idx >= 0) setShelfOffset(clampOffset(positions[idx]))
  }

  const closeInspect = () => {
    setInspecting(false)
    setSelectedId(null)
  }

  const nudge = (dir: -1 | 1) => {
    if (inspecting) return
    setShelfOffset((o) => clampOffset(o + dir * 0.85))
  }

  const goMarker = (i: number) => {
    if (inspecting) return
    const t = i / Math.max(MARKERS - 1, 1)
    const target = -maxOffset + t * (maxOffset * 2)
    setShelfOffset(clampOffset(target))
  }

  const canvasWrapRef = useRef<HTMLDivElement>(null)

  // Teclado + wheel (passive: false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inspecting) {
        setInspecting(false)
        setSelectedId(null)
        return
      }
      if (inspecting) return
      if (e.key === 'ArrowLeft') {
        setShelfOffset((o) => clampOffset(o - 0.85))
      }
      if (e.key === 'ArrowRight') {
        setShelfOffset((o) => clampOffset(o + 0.85))
      }
    }
    const el = canvasWrapRef.current
    const onWheelNative = (e: WheelEvent) => {
      if (inspecting) return
      e.preventDefault()
      setShelfOffset((o) =>
        clampOffset(o + e.deltaY * 0.004 + e.deltaX * 0.004)
      )
    }
    window.addEventListener('keydown', onKey)
    el?.addEventListener('wheel', onWheelNative, { passive: false })
    return () => {
      window.removeEventListener('keydown', onKey)
      el?.removeEventListener('wheel', onWheelNative)
    }
  }, [inspecting, clampOffset])

  const onPointerDown = (e: React.PointerEvent) => {
    if (inspecting) return
    drag.current = { active: true, x: e.clientX, offset: shelfOffset }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || inspecting) return
    const dx = e.clientX - drag.current.x
    setShelfOffset(clampOffset(drag.current.offset - dx * 0.012))
  }
  const onPointerUp = () => {
    drag.current.active = false
  }

  const activeMarker = useMemo(() => {
    if (maxOffset <= 0) return 0
    const t = (shelfOffset + maxOffset) / (maxOffset * 2)
    return Math.round(t * (MARKERS - 1))
  }, [shelfOffset, maxOffset])

  return (
    <div className="recursos-shelf">
      <div
        ref={canvasWrapRef}
        className="recursos-shelf__canvas-wrap"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 1.15, 4.2], fov: 42, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <ShelfScene
              selectedId={selectedId}
              inspecting={inspecting}
              shelfOffset={shelfOffset}
              onSelect={handleSelect}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI editorial */}
      <header className="recursos-shelf__header">
        <p className="recursos-shelf__eyebrow">The Complete Shelf</p>
        <h1 className="recursos-shelf__title">Recursos</h1>
        <p className="recursos-shelf__lede">
          Recorre la estantería y abre un volumen para inspeccionarlo.
        </p>
      </header>

      {!inspecting && (
        <div className="recursos-shelf__controls">
          <button
            type="button"
            className="recursos-shelf__nav-btn"
            onClick={() => nudge(-1)}
            aria-label="Mover estantería a la izquierda"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          <div className="recursos-shelf__markers" role="tablist" aria-label="Posición">
            {Array.from({ length: MARKERS }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={activeMarker === i}
                className={`recursos-shelf__marker ${
                  activeMarker === i ? 'is-active' : ''
                }`}
                onClick={() => goMarker(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="recursos-shelf__nav-btn"
            onClick={() => nudge(1)}
            aria-label="Mover estantería a la derecha"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {inspecting && selectedBook && (
        <aside className="recursos-shelf__inspect-panel">
          <button
            type="button"
            className="recursos-shelf__close"
            onClick={closeInspect}
            aria-label="Volver a la estantería"
          >
            <X size={18} strokeWidth={1.5} />
            <span>Volver</span>
          </button>
          <p className="recursos-shelf__inspect-kicker">{selectedBook.subtitle}</p>
          <h2 className="recursos-shelf__inspect-title">{selectedBook.title}</h2>
          <p className="recursos-shelf__inspect-hint">
            Arrastra para orbitar · scroll para zoom · Esc para cerrar
          </p>
        </aside>
      )}

      <p className="recursos-shelf__asset-note" title={COMPLETE_SHELF_MANIFEST.version}>
        {COMPLETE_SHELF_MANIFEST.source === 'procedural'
          ? '19 volúmenes · pack procedural (listo para Mint)'
          : '19 volúmenes · Mint assets'}
      </p>
    </div>
  )
}
