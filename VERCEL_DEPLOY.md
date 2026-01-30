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
