# Question Card App

Aplicación interactiva de cartas de preguntas con animaciones fluidas usando Next.js, Framer Motion y Supabase.

## Características

- 🎴 Mazo interactivo de cartas con animaciones
- 🎨 Diseño moderno y responsivo
- 🎯 Animación de barajado y selección de cartas
- 🗄️ Integración con Supabase para almacenamiento de datos
- ⚡ Construido con Next.js 14 (App Router) y TypeScript

## Requisitos Previos

- Node.js 18+ 
- Cuenta de Supabase configurada
- npm o yarn

## Instalación

1. Clona el repositorio o navega al directorio del proyecto

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia `.env.local.example` a `.env.local`
   - Agrega tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```

4. Configura la base de datos:
   - Ve a tu proyecto de Supabase
   - Ejecuta el script SQL en `supabase/migrations/001_initial_schema.sql` en el SQL Editor
   - Esto creará las tablas `categories` y `questions` con datos de ejemplo

## Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
├── app/
│   ├── actions/          # Server Actions
│   ├── globals.css       # Estilos globales y variables CSS
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── components/
│   ├── CardDeckContainer.tsx  # Componente principal del mazo
│   └── QuestionCard.tsx       # Componente de tarjeta individual
├── types/
│   ├── animation.types.ts     # Tipos para animaciones
│   └── database.types.ts      # Tipos de Supabase
├── utils/
│   └── supabase/         # Clientes de Supabase
└── supabase/
    └── migrations/       # Scripts SQL de migración
```

## Uso

1. Al cargar la página, verás un mazo de cartas en posición de abanico
2. Haz clic en "Dame una pregunta" para iniciar la animación de barajado
3. Después de 3 segundos, se revelará una carta ganadora
4. Haz clic en "Otra pregunta" para reiniciar el proceso

## Personalización

### Colores

Los colores se pueden personalizar en `app/globals.css` modificando las variables CSS:

```css
:root {
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  /* ... más colores */
}
```

### Animaciones

Las animaciones se pueden ajustar en `components/CardDeckContainer.tsx` modificando los `variants` de Framer Motion.

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones fluidas
- **Supabase** - Backend como servicio
- **Lucide React** - Iconos

## Licencia

MIT
