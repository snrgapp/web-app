'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BookMesh } from './BookMesh'
import {
  buildShelfCatalog,
  layoutBooksOnShelf,
  type ShelfBook,
} from '@/lib/recursos/shelf-catalog'

type OrbitRef = {
  target: THREE.Vector3
  update: () => void
}

type Props = {
  selectedId: string | null
  inspecting: boolean
  shelfOffset: number
  onSelect: (id: string) => void
  booksRef?: React.MutableRefObject<ShelfBook[]>
}

function WalnutShelf({ width }: { width: number }) {
  const shelfW = Math.max(width + 2.4, 10)
  const wood = '#5C4033'
  const dark = '#3E2A22'

  return (
    <group>
      {/* Tablero */}
      <mesh position={[0, -0.08, 0.1]} receiveShadow castShadow>
        <boxGeometry args={[shelfW, 0.12, 1.6]} />
        <meshStandardMaterial color={wood} roughness={0.75} metalness={0.05} />
      </mesh>
      {/* Frente */}
      <mesh position={[0, -0.22, 0.85]} receiveShadow>
        <boxGeometry args={[shelfW, 0.28, 0.1]} />
        <meshStandardMaterial color={dark} roughness={0.8} />
      </mesh>
      {/* Fondo */}
      <mesh position={[0, 0.9, -0.7]} receiveShadow>
        <boxGeometry args={[shelfW + 0.4, 2.4, 0.12]} />
        <meshStandardMaterial color="#EDE6DA" roughness={0.95} />
      </mesh>
    </group>
  )
}

export function ShelfScene({
  selectedId,
  inspecting,
  shelfOffset,
  onSelect,
  booksRef,
}: Props) {
  const books = useMemo(() => buildShelfCatalog(), [])
  const { positions, totalWidth } = useMemo(
    () => layoutBooksOnShelf(books),
    [books]
  )
  const group = useRef<THREE.Group>(null)
  const controls = useRef<OrbitRef | null>(null)
  const { camera } = useThree()

  if (booksRef) booksRef.current = books

  const selectedIndex = selectedId
    ? books.findIndex((b) => b.id === selectedId)
    : -1
  const selectedBook = selectedIndex >= 0 ? books[selectedIndex] : null
  const selectedX = selectedIndex >= 0 ? positions[selectedIndex] : 0

  useFrame((_, dt) => {
    if (!group.current) return

    if (inspecting && selectedBook) {
      // Centrar cámara en el libro
      const target = new THREE.Vector3(selectedX, selectedBook.height * 0.35, 0.2)
      camera.position.x = THREE.MathUtils.damp(camera.position.x, selectedX + 1.2, 4, dt)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.1, 4, dt)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 2.4, 4, dt)
      if (controls.current) {
        controls.current.target.lerp(target, 1 - Math.exp(-4 * dt))
        controls.current.update()
      }
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 0, 5, dt)
    } else {
      group.current.position.x = THREE.MathUtils.damp(
        group.current.position.x,
        -shelfOffset,
        6,
        dt
      )
      camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 5, dt)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.15, 5, dt)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 4.2, 5, dt)
      if (controls.current) {
        controls.current.target.lerp(new THREE.Vector3(0, 0.6, 0), 1 - Math.exp(-5 * dt))
        controls.current.update()
      }
    }
  })

  return (
    <>
      <color attach="background" args={['#F3EEE4']} />
      <fog attach="fog" args={['#F3EEE4', 8, 22]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, 2]} intensity={0.35} color="#fff5e6" />

      <Environment preset="apartment" />

      <group ref={group}>
        <WalnutShelf width={totalWidth} />
        {books.map((book, i) => {
          if (inspecting && selectedId && book.id !== selectedId) return null
          const y = book.height / 2
          return (
            <BookMesh
              key={book.id}
              book={book}
              position={[positions[i], y, 0]}
              selected={book.id === selectedId}
              inspecting={inspecting}
              onSelect={onSelect}
            />
          )
        })}
      </group>

      <ContactShadows
        position={[0, -0.14, 0]}
        opacity={0.35}
        scale={20}
        blur={2.5}
        far={6}
      />

      <OrbitControls
        ref={controls as never}
        enabled={inspecting}
        enablePan={inspecting}
        enableZoom={inspecting}
        minDistance={1.2}
        maxDistance={5}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.2}
      />
    </>
  )
}

export { buildShelfCatalog }
