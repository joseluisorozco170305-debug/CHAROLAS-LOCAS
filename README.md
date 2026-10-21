# Charolas Locas 🍓

Página de pedidos de Charolas Locas: menú, carrito, envío por zona y ruta,
modo local para la tablet y panel del equipo.

Diseñada y desarrollada por **Tomate Desarrollo Web**.

## Correr en tu compu

```bash
npm install
npm run dev
```

Crea un `.env.local` copiando `.env.example` y pon tus valores.

## Variables de entorno

| Variable | Para qué |
|---|---|
| `VITE_SUPABASE_URL` | URL de tu proyecto de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Llave pública (anon) de Supabase |
| `VITE_SITE_URL` | Dominio público, sin `/` al final (canonical, vista previa en WhatsApp y sitemap) |

En Vercel van en **Settings → Environment Variables**. Después de cambiarlas,
vuelve a desplegar.

## Rutas

| Ruta | Qué es | Google |
|---|---|---|
| `/` | Menú y pedidos | Sí aparece |
| `/local` | Tablet del local (con contraseña) | No |
| `/admin` | Panel del equipo (con login) | No |

Los títulos, descripciones e imagen de cada ruta están en `src/shell/seo.ts`.
Al hacer `npm run build` se generan el HTML de cada ruta, `sitemap.xml` y `robots.txt`.

## Supabase

Los scripts para correr en el **SQL Editor** están en `supabase/`.
