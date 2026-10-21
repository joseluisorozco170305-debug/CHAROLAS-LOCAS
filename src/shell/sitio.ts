/** URL pública del sitio para canonical y og:url en el navegador. */
export const SITIO_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ||
  (typeof window !== "undefined" ? window.location.origin : "")
).replace(/\/+$/, "");
