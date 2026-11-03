import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/* Portadas de categoría (formato "póster" con el estilo de Charolas)  */
/* ------------------------------------------------------------------ */

interface Portada {
  /** Título grande del póster, una palabra por renglón. */
  titulo: string[];
  /** Fondo del póster (clases de Tailwind). */
  fondo: string;
  /** Color del título. */
  tinta: string;
  /** Ilustraciones 3D: [principal, secundaria]. Viven en /public/menu-3d. */
  imagenes: [string, string];
  /**
   * Foto real opcional. Si algún día tienes foto de la categoría, ponla en
   * /public/categorias/ y escribe aquí la ruta (ej. "/categorias/dulces.jpg").
   * Reemplaza a las ilustraciones.
   */
  foto?: string;
}

const CREMA = "text-[#fff6ea]";

const portadas: Record<string, Portada> = {
  todos: {
    titulo: ["TODO EL", "MENÚ"],
    fondo: "bg-gradient-to-br from-rose-950 via-pink-900 to-fuchsia-900",
    tinta: "text-pink-200",
    imagenes: ["hamburguesa", "dona"],
  },
  favoritos: {
    titulo: ["MIS", "FAVS"],
    fondo: "bg-gradient-to-br from-pink-200 via-rose-100 to-orange-100",
    tinta: "text-pink-600",
    imagenes: ["corazon", "brillos"],
  },
  "pan-de-muerto": {
    titulo: ["PAN DE", "MUERTO"],
    fondo: "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-300",
    tinta: CREMA,
    imagenes: ["pan", "flor"],
  },
  "todo-con-crema": {
    titulo: ["CON", "CREMA"],
    fondo: "bg-gradient-to-br from-pink-500 via-rose-400 to-pink-300",
    tinta: CREMA,
    imagenes: ["fresa", "helado"],
  },
  dulces: {
    titulo: ["DULCES"],
    fondo: "bg-gradient-to-br from-fuchsia-600 via-fuchsia-500 to-pink-400",
    tinta: CREMA,
    imagenes: ["waffle", "chocolate"],
  },
  "frutas-saladas": {
    titulo: ["FRUTAS", "SALADAS"],
    fondo: "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-400",
    tinta: CREMA,
    imagenes: ["mango", "chile"],
  },
  "snacks-calientes": {
    titulo: ["SNACKS"],
    fondo: "bg-gradient-to-br from-red-500 via-orange-500 to-amber-400",
    tinta: CREMA,
    imagenes: ["papas", "pierna"],
  },
  "charolas-locas": {
    titulo: ["CHAROLAS", "LOCAS"],
    fondo: "bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500",
    tinta: CREMA,
    imagenes: ["charola", "queso"],
  },
  bebidas: {
    titulo: ["DRINKS"],
    fondo: "bg-gradient-to-br from-sky-500 via-cyan-400 to-teal-300",
    tinta: CREMA,
    imagenes: ["coctel", "frappe"],
  },
};

const portadaDe = (id: string): Portada =>
  portadas[id] ?? {
    titulo: [id.toUpperCase()],
    fondo: "bg-gradient-to-br from-pink-500 to-orange-400",
    tinta: CREMA,
    imagenes: ["fresa", "brillos"],
  };

const img = (nombre: string) => `/menu-3d/${nombre}.webp`;

/** Puntitos de fondo, para que el póster no se vea plano. */
const puntitos = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,.22) 1.4px, transparent 1.6px)",
  backgroundSize: "16px 16px",
};

export interface CategoriaItem {
  id: string;
  nombre: string;
  cantidad: number;
}

/* ------------------------------------------------------------------ */
/* Vista principal: cuadrícula de pósters                              */
/* ------------------------------------------------------------------ */

export function CategoryGrid({
  items,
  onSelect,
  compact = false,
}: {
  items: CategoriaItem[];
  onSelect: (id: string) => void;
  /** Modo local: el menú comparte pantalla con el carrito, va más angosto. */
  compact?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:gap-5 ${
        compact ? "xl:grid-cols-3" : "lg:grid-cols-3 lg:gap-6"
      }`}
    >
      {items.map((item) => {
        const portada = portadaDe(item.id);
        const [principal, secundaria] = portada.imagenes;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="group overflow-hidden rounded-[1.5rem] bg-white text-left shadow-[0_10px_30px_rgba(236,72,153,0.10)] ring-1 ring-pink-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(236,72,153,0.20)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 sm:rounded-[1.75rem]"
          >
            <div
              className={`relative aspect-square overflow-hidden sm:aspect-[16/11] ${portada.fondo}`}
            >
              {portada.foto ? (
                <>
                  <img
                    src={portada.foto}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0" style={puntitos} />
                  <div className="absolute -bottom-10 -right-10 h-3/4 w-3/4 rounded-full bg-white/25 blur-2xl" />

                  <img
                    src={img(secundaria)}
                    alt=""
                    loading="lazy"
                    className="absolute bottom-[8%] right-[46%] w-[30%] -rotate-12 drop-shadow-[0_10px_12px_rgba(0,0,0,.18)] transition duration-500 group-hover:-translate-y-1 group-hover:-rotate-[20deg]"
                  />
                  <img
                    src={img(principal)}
                    alt=""
                    loading="lazy"
                    className="absolute -bottom-[6%] -right-[4%] w-[58%] rotate-[10deg] drop-shadow-[0_18px_22px_rgba(0,0,0,.25)] transition duration-500 group-hover:rotate-[2deg] group-hover:scale-110"
                  />
                </>
              )}

              <p
                className={`soft-heading absolute left-3 top-3 text-[1.45rem] font-extrabold leading-[.9] tracking-tight [text-shadow:0_3px_0_rgba(0,0,0,.12)] sm:left-5 sm:top-4 sm:text-[2.6rem] ${portada.tinta}`}
              >
                {portada.titulo.map((linea) => (
                  <span key={linea} className="block">
                    {linea}
                  </span>
                ))}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <p className="soft-heading truncate text-sm font-extrabold text-rose-950 sm:text-xl">
                  {item.nombre}
                </p>
                <p className="text-[11px] font-bold text-rose-950/45 sm:text-xs">
                  {item.cantidad} antojo{item.cantidad === 1 ? "" : "s"}
                </p>
              </div>

              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink-50 text-pink-500 transition group-hover:bg-pink-500 group-hover:text-white sm:h-10 sm:w-10">
                <ArrowRight size={17} />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dentro de una categoría: barra de categorías + regresar             */
/* ------------------------------------------------------------------ */

export function CategoryRail({
  items,
  active,
  onSelect,
  onBack,
  stickyTop = "top-20",
}: {
  items: CategoriaItem[];
  active: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  /** Clase de Tailwind según el alto del header (top-20 tienda, top-16 local). */
  stickyTop?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const activeTitle = items.find((item) => item.id === active)?.nombre ?? "";

  // Centra la categoría activa en la barra (sin mover la página).
  useEffect(() => {
    const rail = railRef.current;
    const button = rail?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (!rail || !button) return;

    rail.scrollTo({
      left: button.offsetLeft - rail.clientWidth / 2 + button.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <>
      <div className={`sticky ${stickyTop} z-30 -mx-4 mb-6 border-b border-pink-100 bg-[#fff9fc]/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}>
        <div
          ref={railRef}
          className="menu-scroll flex gap-1 overflow-x-auto py-3 sm:justify-center"
        >
          {items.map((item) => {
            const portada = portadaDe(item.id);
            const isActive = item.id === active;

            return (
              <button
                key={item.id}
                data-cat={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex w-[5.25rem] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-1 py-1 transition sm:w-24"
              >
                <span
                  className={`relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl transition sm:h-14 sm:w-14 ${portada.fondo} ${
                    isActive
                      ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-[#fff9fc]"
                      : "opacity-80 group-hover:opacity-100"
                  }`}
                >
                  {portada.foto ? (
                    <img src={portada.foto} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <img
                      src={img(portada.imagenes[0])}
                      alt=""
                      className="w-[78%] drop-shadow-[0_6px_6px_rgba(0,0,0,.18)] transition group-hover:scale-110"
                    />
                  )}
                </span>

                <span
                  className={`line-clamp-2 text-center text-[11px] font-extrabold leading-tight sm:text-xs ${
                    isActive
                      ? "text-pink-600 underline decoration-2 underline-offset-4"
                      : "text-rose-950/70"
                  }`}
                >
                  {item.nombre}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-7 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-extrabold text-rose-950 ring-1 ring-pink-100 transition hover:bg-pink-50 hover:ring-pink-200"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Menú principal</span>
        </button>

        <h3 className="soft-heading truncate text-center text-2xl font-extrabold text-rose-950 sm:text-3xl">
          {activeTitle}
        </h3>

        {/* Espaciador para que el título quede centrado */}
        <span className="w-10 sm:w-[9.5rem]" aria-hidden />
      </div>
    </>
  );
}
