import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO_404, seoDeRuta } from "./seo";
import { SITIO_URL } from "./sitio";

const meta = (selector: string, attr: string, nombre: string, valor: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, nombre);
    document.head.appendChild(el);
  }
  el.content = valor;
};

/** Actualiza título, description, canonical, og:*, robots y theme-color al cambiar de vista. */
export function useSeoDeRuta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const s = seoDeRuta(pathname) ?? SEO_404;
    const url = `${SITIO_URL}${s === SEO_404 ? pathname : s.ruta === "/" ? "/" : s.ruta}`;
    const img = `${SITIO_URL}${s.imagen}`;

    document.title = s.titulo;
    meta('meta[name="description"]', "name", "description", s.descripcion);
    meta('meta[name="robots"]', "name", "robots", s.indexar ? "index, follow" : "noindex, nofollow");
    meta('meta[name="theme-color"]', "name", "theme-color", s.colorTema);
    meta('meta[property="og:title"]', "property", "og:title", s.titulo);
    meta('meta[property="og:description"]', "property", "og:description", s.descripcion);
    meta('meta[property="og:url"]', "property", "og:url", url);
    meta('meta[property="og:image"]', "property", "og:image", img);
    meta('meta[name="twitter:image"]', "name", "twitter:image", img);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [pathname]);
}
