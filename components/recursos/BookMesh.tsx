'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import type { ShelfBook } from '@/lib/recursos/shelf-catalog'

type Props = {
  book: ShelfBook
  position: [number, number, number]
  selected: boolean
  inspecting: boolean
  onSelect: (id: string) => void
}

function createFoilTexture(book: ShelfBook): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = book.cloth
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = book.foil
  ctx.fillStyle = book.foil
  ctx.lineWidth = 4
  ctx.globalAlpha = 0.85

  const m = size * 0.5
  switch (book.motif) {
    case 'arc':
      ctx.beginPath()
      ctx.arc(m, m + 20, 70, Math.PI * 1.1, Math.PI * 1.9)
      ctx.stroke()
      break
    case 'grid':
      for (let i = 0; i < 4; i++) {
        const o = 60 + i * 36
        ctx.beginPath()
        ctx.moveTo(o, 50)
        ctx.lineTo(o, size - 50)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(50, o)
        ctx.lineTo(size - 50, o)
        ctx.stroke()
      }
      break
    case 'orbit':
      ctx.beginPath()
      ctx.arc(m, m, 55, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(m + 30, m - 10, 28, 0, Math.PI * 2)
      ctx.stroke()
      break
    case 'slash':
      ctx.beginPath()
      ctx.moveTo(70, size - 60)
      ctx.lineTo(size - 60, 70)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(90, size - 50)
      ctx.lineTo(size - 50, 90)
      ctx.stroke()
      break
    case 'dot':
      for (const [x, y] of [
        [m, m],
        [m - 40, m + 30],
        [m + 45, m - 25],
        [m + 10, m + 50],
      ]) {
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()
      }
      break
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function BookMesh({ book, position, selected, inspecting, onSelect }: Props) {
  const group = useRef<THREE.Group>(null)
  const foilMap = useMemo(() => createFoilTexture(book), [book])
  const targetZ = selected && !inspecting ? 0.35 : 0
  const targetY = 0

  useFrame((_, dt) => {
    if (!group.current) return
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      inspecting && selected ? 0 : targetZ + position[2],
      6,
      dt
    )
    if (!inspecting || !selected) {
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        position[1] + targetY,
        8,
        dt
      )
      group.current.position.x = THREE.MathUtils.damp(
        group.current.position.x,
        position[0],
        8,
        dt
      )
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(book.id)
  }

  const { width: w, height: h, depth: d } = book
  const pageColor = '#F7F1E6'

  return (
    <group
      ref={group}
      position={position}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Bloque del libro */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={book.cloth} roughness={0.82} metalness={0.08} />
      </mesh>

      {/* Cubierta frontal con foil */}
      <mesh position={[0, 0, d / 2 + 0.002]} castShadow>
        <planeGeometry args={[w * 0.92, h * 0.92]} />
        <meshStandardMaterial
          map={foilMap}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* Páginas (borde) */}
      <mesh position={[w / 2 - 0.01, 0, 0]}>
        <boxGeometry args={[0.02, h * 0.92, d * 0.88]} />
        <meshStandardMaterial color={pageColor} roughness={0.95} />
      </mesh>

      {/* Lomo accent */}
      <mesh position={[0, 0, -d / 2 + 0.01]}>
        <boxGeometry args={[w * 0.7, 0.03, 0.02]} />
        <meshStandardMaterial color={book.foil} roughness={0.4} metalness={0.35} />
      </mesh>
    </group>
  )
}
