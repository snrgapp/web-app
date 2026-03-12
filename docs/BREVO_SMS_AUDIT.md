# Auditoría: Integración Brevo SMS (deprecado para login de miembros)

## Resumen

**Nota:** El login de miembros ya no usa OTP por SMS. Ahora se autentica con **teléfono + contraseña**.

El envío de SMS (si se usara para otros fines) usa la **API REST de Brevo** (`/v3/transactionalSMS/send`). La misma clave `BREVO_API_KEY` sirve para email (formularios) y SMS.

---

## API key: SMTP vs API

| Concepto | Respuesta |
|----------|-----------|
| **¿Claves distintas?** | No. En Brevo, la clave en **SMTP & API** es la misma. |
| **¿Qué clave usar?** | `BREVO_API_KEY` con formato `xkeysib-...` |
| **¿Dónde obtenerla?** | Brevo > Tu cuenta > Configuración > SMTP & API |

No uses credenciales SMTP (usuario/contraseña) para la API. La API usa solo el header `api-key`.

---

## Requisitos para que funcione el SMS

1. **Créditos SMS**: Brevo requiere **comprar créditos** por separado.  
   - Ir a: **Mi Plan > SMS & WhatsApp**  
   - Sin créditos, la API responde `402` (Payment Required)

2. **Sender aprobado**: El valor de `BREVO_SMS_SENDER` (ej. "Synergy") debe estar registrado/aprobado en tu cuenta Brevo. Máx 11 caracteres alfanuméricos.

3. **Redis (Upstash)**: El OTP se guarda en Redis antes de enviar el SMS.  
   - Si `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` están vacíos, la petición falla con 503 **antes** de llegar a Brevo.  
   - Crear base de datos en [console.upstash.com](https://console.upstash.com)

---

## Flujo de login de miembros (actual)

```
POST /api/miembros/auth/login
  → phone + password
  → Rate limit (Upstash)
  → Validar miembro en Supabase (phone + password_hash)
  → Crear sesión y redirect
```

El endpoint `/api/miembros/auth/send-code` fue eliminado. Ya no se usa OTP ni SMS para login.

---

## Correcciones aplicadas (2025-02-28)

- **Formato del número**: Evita duplicar el código de país cuando el usuario envía "573001234567" (antes se generaba "57573001234567").
- **Logging**: Se registra la respuesta completa de Brevo en errores para depurar.
- **Error 402**: Mensaje específico cuando faltan créditos SMS.
- **Header Accept**: Añadido para cumplir con la API de Brevo.

---

## Checklist de verificación

- [ ] `BREVO_API_KEY` configurada (xkeysib-...)
- [ ] Créditos SMS comprados en Brevo
- [ ] `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` configurados
- [ ] `BREVO_SMS_SENDER` (opcional, default: Synergy)
- [ ] `DEFAULT_SMS_COUNTRY_CODE=57` si aplica (Colombia)
