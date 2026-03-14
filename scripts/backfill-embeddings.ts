/**
 * Uso: npx tsx scripts/backfill-embeddings.ts
 * Carga .env.local
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import {
  generateProfileEmbeddings,
  type PerfilParaEmbedding,
} from '../services/embeddings'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

if (!url || !key) {
  console.error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o equivalentes)'
  )
  process.exit(1)
}
if (!process.env.VOYAGE_API_KEY) {
  console.error('Falta VOYAGE_API_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

function perfilTieneMinimo(p: PerfilParaEmbedding) {
  return p.descripcion_negocio && p.busca_detalle && p.ofrece
}

async function main() {
  console.log('🚀 Backfill embeddings (Voyage fetch)...\n')

  const { data: perfiles, error } = await supabase
    .from('ia_call_profiles')
    .select(
      `
      id,
      contacto_nombre,
      nombre_negocio,
      descripcion_negocio,
      tipo_negocio,
      momento_negocio,
      cliente_objetivo,
      busca_primario,
      busca_detalle,
      busca_secundario,
      ofrece,
      logro_notable,
      ciudad_principal,
      listo_para_matching
    `
    )
    .is('embedding_need', null)

  if (error) {
    console.error('❌', error.message)
    process.exit(1)
  }

  const list = (perfiles || []) as PerfilParaEmbedding[]
  console.log(`📋 Sin embedding_need: ${list.length}\n`)
  if (list.length === 0) {
    console.log('✅ Nada que procesar.')
    process.exit(0)
  }

  let ok = 0
  let skip = 0
  let fail = 0

  for (const perfil of list) {
    const row = {
      ...perfil,
      sector: perfil.sector ?? perfil.tipo_negocio,
    }
    process.stdout.write(`⚙️  ${row.contacto_nombre || row.id}... `)
    if (!perfilTieneMinimo(row)) {
      console.log('⏭️  omitido')
      skip++
      continue
    }
    try {
      const { embedding_need, embedding_offer } =
        await generateProfileEmbeddings(row)
      const { error: u } = await supabase
        .from('ia_call_profiles')
        .update({
          embedding_need,
          embedding_offer,
          listo_para_matching: true,
        })
        .eq('id', row.id!)
      if (u) throw new Error(u.message)
      console.log('✅')
      ok++
      await new Promise((r) => setTimeout(r, 200))
    } catch (e) {
      console.log('❌', e instanceof Error ? e.message : e)
      fail++
    }
  }

  console.log('\n✅', ok, '⏭️', skip, '❌', fail)
}

main()
