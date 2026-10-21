import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { htmlSeo, rutasSeo } from "./src/shell/seo.ts";

const BLOQUE = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

/** URL pública: VITE_SITE_URL, o la de producción que Vercel expone sola. */
const urlDelSitio = (mode: string) => {
  const env = loadEnv(mode, process.cwd(), "");
  const url =
    env.VITE_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  if (!url) {
    console.warn(
      "\n⚠️  [seo] Falta VITE_SITE_URL: canonical, og:image y sitemap usarán un dominio de ejemplo.\n" +
        "    Defínela en Vercel → Settings → Environment Variables y vuelve a desplegar.\n",
    );
    return "https://charolas-locas.vercel.app";
  }
  return url.replace(/\/+$/, "");
};

/**
 * - Mete en index.html las etiquetas SEO / Open Graph de "/".
 * - Al terminar el build copia index.html a dist/<ruta>/index.html con las
 *   etiquetas de cada ruta (WhatsApp y Google no ejecutan JS).
 * - Genera sitemap.xml y robots.txt.
 */
const seoPorRuta = (sitio: string): Plugin => {
  let outDir = "dist";
  return {
    name: "charolas-seo-por-ruta",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      const inicio = rutasSeo.find((r) => r.ruta === "/")!;
      return html.replace(
        BLOQUE,
        `<!--seo:start-->\n    ${htmlSeo(inicio, sitio)}\n    <!--seo:end-->`,
      );
    },
    closeBundle() {
      const base = readFileSync(resolve(outDir, "index.html"), "utf8");

      for (const ruta of rutasSeo.filter((r) => r.ruta !== "/")) {
        const destino = resolve(outDir, `.${ruta.ruta}/index.html`);
        mkdirSync(dirname(destino), { recursive: true });
        writeFileSync(
          destino,
          base.replace(
            BLOQUE,
            `<!--seo:start-->\n    ${htmlSeo(ruta, sitio)}\n    <!--seo:end-->`,
          ),
        );
      }

      const hoy = new Date().toISOString().slice(0, 10);
      const urls = rutasSeo
        .filter((r) => r.indexar)
        .map(
          (r) =>
            `  <url>\n    <loc>${sitio}${r.ruta}</loc>\n    <lastmod>${hoy}</lastmod>\n  </url>`,
        )
        .join("\n");
      writeFileSync(
        resolve(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );

      const privadas = rutasSeo.filter((r) => !r.indexar);
      writeFileSync(
        resolve(outDir, "robots.txt"),
        [
          "User-agent: *",
          "Allow: /",
          ...privadas.map((r) => `Disallow: ${r.ruta}`),
          "",
          `Sitemap: ${sitio}/sitemap.xml`,
          "",
        ].join("\n"),
      );
    },
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), seoPorRuta(urlDelSitio(mode))],
  build: { sourcemap: false },
  css: { devSourcemap: false },
}));
