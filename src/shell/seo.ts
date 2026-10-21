/**
 * Única fuente de datos de SEO por ruta.
 * La usan: el plugin de Vite (HTML estático por ruta, sitemap, robots)
 * y la app (actualiza las etiquetas al cambiar de vista).
 * No uses APIs del navegador aquí: también corre en Node al hacer el build.
 */
export interface SeoRuta {
  ruta: string;
  titulo: string;
  /** ≤ 160 caracteres */
  descripcion: string;
  /** Ruta de la imagen 1200×630 dentro de /public */
  imagen: string;
  imagenAlt: string;
  colorTema: string;
  /** false = noindex (no aparece en Google ni en el sitemap) */
  indexar: boolean;
}

export const NOMBRE_SITIO = "Charolas Locas";

export const rutasSeo: SeoRuta[] = [
  {
    ruta: "/",
    titulo: "Charolas Locas · Fresas con crema, snacks y charolas",
    descripcion:
      "Fresas con crema, snacks calientes, charolas locas y drinks preparados al momento. Arma tu pedido en línea y te lo llevamos o pásalo a recoger.",
    imagen: "/og-image.jpg",
    imagenAlt: "Charolas Locas: fresas con crema, snacks, charolas y drinks",
    colorTema: "#db2777",
    indexar: true,
  },
  {
    ruta: "/local",
    titulo: "Modo local · Charolas Locas",
    descripcion: "Vista para tomar pedidos en la tablet del local.",
    imagen: "/og-image.jpg",
    imagenAlt: "Charolas Locas",
    colorTema: "#db2777",
    indexar: false,
  },
  {
    ruta: "/admin",
    titulo: "Panel · Charolas Locas",
    descripcion: "Panel privado del equipo de Charolas Locas.",
    imagen: "/og-image.jpg",
    imagenAlt: "Charolas Locas",
    colorTema: "#0f172a",
    indexar: false,
  },
];

export const SEO_404: SeoRuta = {
  ruta: "/404",
  titulo: "Página no encontrada · Charolas Locas",
  descripcion: "Esta página no existe. Regresa al menú de Charolas Locas.",
  imagen: "/og-image.jpg",
  imagenAlt: "Charolas Locas",
  colorTema: "#db2777",
  indexar: false,
};

/** Quita la barra final ("/admin/" → "/admin"). */
export const normalizarRuta = (ruta: string) =>
  ruta.length > 1 ? ruta.replace(/\/+$/, "") : ruta;

/** Datos de la ruta; las subrutas (/admin/lo-que-sea) heredan de su base. */
export const seoDeRuta = (ruta: string): SeoRuta | null => {
  const r = normalizarRuta(ruta);
  return (
    rutasSeo.find((s) => s.ruta === r) ??
    rutasSeo.find((s) => s.ruta !== "/" && r.startsWith(`${s.ruta}/`)) ??
    null
  );
};

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Bloque de etiquetas <head> para una ruta (HTML estático). */
export const htmlSeo = (s: SeoRuta, sitio: string) => {
  const url = `${sitio}${s.ruta === "/" ? "/" : s.ruta}`;
  const img = `${sitio}${s.imagen}`;
  return [
    `<title>${esc(s.titulo)}</title>`,
    `<meta name="description" content="${esc(s.descripcion)}" />`,
    `<meta name="robots" content="${s.indexar ? "index, follow" : "noindex, nofollow"}" />`,
    `<meta name="theme-color" content="${s.colorTema}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${NOMBRE_SITIO}" />`,
    `<meta property="og:locale" content="es_MX" />`,
    `<meta property="og:title" content="${esc(s.titulo)}" />`,
    `<meta property="og:description" content="${esc(s.descripcion)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:secure_url" content="${img}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(s.imagenAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(s.titulo)}" />`,
    `<meta name="twitter:description" content="${esc(s.descripcion)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ].join("\n    ");
};
