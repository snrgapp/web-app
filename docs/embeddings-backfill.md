# Embeddings (Voyage fetch) + backfill

| Archivo | Rol |
|---------|-----|
| `services/embeddings.ts` | Voyage por **fetch** (sin SDK) |
| `scripts/backfill-embeddings.ts` | Backfill vía **tsx** |

## Comando

```bash
npm run backfill-embeddings
```

(`npx tsx scripts/backfill-embeddings.ts` — carga `.env.local`)

## Verificación SQL

```sql
SELECT id, contacto_nombre, listo_para_matching,
       embedding_need IS NOT NULL AS tiene_need,
       embedding_offer IS NOT NULL AS tiene_offer
FROM ia_call_profiles;
```
