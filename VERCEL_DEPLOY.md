# Despliegue en Vercel

## 1. Conectar el repositorio

1. Entra en **[vercel.com](https://vercel.com)** e inicia sesión (con GitHub).
2. Clic en **"Add New..."** → **"Project"**.
3. En **"Import Git Repository"** selecciona **snrgapp/web-app** (o conéctalo si no aparece).
4. Clic en **Import**.

## 2. Variables de entorno (Supabase)

Antes de desplegar, añade las variables:

1. En la pantalla del proyecto, en **"Environment Variables"**:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`  
     **Value:** tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     **Value:** tu Anon Key de Supabase (desde Supabase → Project Settings → API)

2. Asegúrate de marcar **Production**, **Preview** y **Development** si quieres que apliquen en todos los entornos.

## 3. Deploy

1. Clic en **"Deploy"**.
2. Vercel construirá el proyecto y te dará una URL (ej: `https://web-app-xxx.vercel.app`).

## Actualizaciones

Cada vez que hagas **push a `main`** en GitHub, Vercel desplegará automáticamente una nueva versión.

---

**Nota:** Si no configuras las variables de Supabase, el build puede fallar. Añádelas antes del primer deploy.

---

## Solución de problemas: Error 404

Si ves un 404 en Vercel tras desplegar:

1. **Limpiar caché y redesplegar:**
   - Ve a tu proyecto en [vercel.com](https://vercel.com)
   - Pestaña **Deployments**
   - Haz clic en los tres puntos (⋮) del último deployment
   - Selecciona **Redeploy**
   - Marca la opción **Clear build cache**
   - Haz clic en **Redeploy**

2. **Verificar que el build termina bien:**
   - En el deployment, revisa que el build haya sido exitoso (✓)
   - Si falla, abre los logs y busca errores como `PageNotFoundError` o `Cannot find module`

3. **Probar localmente antes de desplegar:**
   ```bash
   rm -rf .next   # o en Windows: Remove-Item -Recurse -Force .next
   npm run build
   npm run start
   ```
