# Data collection (solo llamada) → Supabase

**No** usamos el formulario para rellenar el perfil de llamada. Todo debe venir del **análisis / data collection** del agente al colgar.

## Identificadores obligatorios (exactos)

| Identificador en ElevenLabs | Columna Supabase |
|----------------------------|------------------|
| `lead_id` | enlace al lead (debe rellenarse en la llamada, p. ej. copiando la variable dinámica) |
| `nombre_negocio` | `nombre_negocio` |
| `contacto_nombre` | `contacto_nombre` (nombre como lo dijo en la llamada) |

## Resto de campos (mismo id = misma columna)

`ciudad_principal`, `descripcion_negocio`, `tipo_negocio`, `momento_negocio`, `antiguedad_negocio`, `cliente_objetivo`, `busca_primario`, `busca_detalle`, `busca_secundario`, `ofrece`, `logro_notable`, `preferencia_conexion`, `referido_por`, `notas_personalidad`, `score_urgencia`, `perfil_completo`, `follow_up_pendiente`

## Prompt del agente (ejemplo)

- Al cerrar, el asistente debe **resumir en data collection** lo dicho en voz (nombre del negocio, nombre de quien habla, ciudad, etc.).
- **No** confiar en que el post-call envíe solo IDs: cada campo que quieras en Supabase necesita **punto de datos** con el **id** de la tabla anterior.

## Si sigue vacío

1. Revisa en Vercel el log: `data collection vacía para esta llamada`.
2. En ElevenLabs, descarga o inspecciona un ejemplo de payload post-call (soporte) y comprueba dónde van los resultados del análisis.
