/**
 * Puente para artifacts Mint.
 * Cuando Mint MCP esté disponible: generar pack → guardar en public/mint/complete-shelf/
 * y mapear book.id → glb/texture aquí. El browser NUNCA llama a MCP.
 */

export type MintBookArtifact = {
  bookId: string
  glb?: string
  albedo?: string
  foilMask?: string
}

export type MintShelfManifest = {
  packId: string
  version: string
  source: 'procedural' | 'mint'
  books: MintBookArtifact[]
}

export const COMPLETE_SHELF_MANIFEST: MintShelfManifest = {
  packId: 'complete-shelf',
  version: '0.1.0-procedural',
  source: 'procedural',
  books: Array.from({ length: 19 }, (_, i) => ({
    bookId: `book-${String(i + 1).padStart(2, '0')}`,
  })),
}

export function getMintArtifact(bookId: string): MintBookArtifact | undefined {
  return COMPLETE_SHELF_MANIFEST.books.find((b) => b.bookId === bookId)
}
