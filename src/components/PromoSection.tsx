import { CalendarClock, ShoppingBag } from "lucide-react";
import { promosVigentes, type Promo } from "../data/promos";
import { diasRestantes, fechaLarga } from "../utils/fecha";
import { MENU_CATEGORY_EVENT } from "../utils/menuEvents";

const irAlMenu = (categoriaId?: string) => {
  if (categoriaId) {
    window.dispatchEvent(
      new CustomEvent(MENU_CATEGORY_EVENT, { detail: categoriaId }),
    );
  }
};

function Vigencia({ hasta }: { hasta: string }) {
  const dias = diasRestantes(hasta);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
      <CalendarClock size={14} />
      Por tiempo limitado · hasta el {fechaLarga(hasta)}
      {dias <= 14 && dias > 0 ? ` (${dias} días)` : ""}
      {dias === 0 ? " (¡último día!)" : ""}
    </span>
  );
}

function PromoCard({ promo, wide }: { promo: Promo; wide: boolean }) {
  return (
    <article
      className={`group overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-[0_18px_45px_rgba(244,114,182,0.14)] ${
        wide ? "md:flex md:items-stretch" : "flex flex-col"
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-slate-100 ${
          wide ? "md:w-[340px]" : ""
        }`}
      >
        <img
          src={promo.imagen}
          alt={`${promo.titulo}: ${promo.etiqueta}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.22em] text-orange-500">
          {promo.etiqueta}
        </p>

        <h3 className="soft-heading mt-2 text-3xl font-black leading-tight text-rose-950 sm:text-4xl">
          {promo.titulo}
        </h3>

        {promo.hasta && (
          <div className="mt-3">
            <Vigencia hasta={promo.hasta} />
          </div>
        )}

        <p className="mt-4 text-base leading-7 text-rose-950/70">
          {promo.descripcion}
        </p>

        {promo.puntos && (
          <ul className="mt-4 grid gap-2 text-sm font-bold text-slate-700 sm:grid-cols-2">
            {promo.puntos.map((punto) => (
              <li
                key={punto}
                className="rounded-2xl bg-pink-50 px-4 py-2.5 ring-1 ring-pink-100"
              >
                {punto}
              </li>
            ))}
          </ul>
        )}

        <a
          href="#menu"
          onClick={() => irAlMenu(promo.categoriaId)}
          className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 px-6 py-4 font-black text-white shadow-[0_12px_26px_rgba(236,72,153,0.28)] transition hover:-translate-y-0.5"
        >
          <ShoppingBag size={18} />
          {promo.boton}
        </a>
      </div>
    </article>
  );
}

export function PromoSection() {
  const activas = promosVigentes();

  if (!activas.length) {
    return null;
  }

  const solaUna = activas.length === 1;

  return (
    <section
      id="promos"
      className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/60 to-white py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-fuchsia-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-[.22em] text-orange-500">
            Promos y temporada
          </p>
          <h2 className="soft-heading mt-2 text-3xl font-black text-rose-950 sm:text-4xl">
            Lo nuevo en Charolas Locas
          </h2>
          <p className="mt-3 text-base font-semibold text-rose-950/60">
            Antojos especiales que solo están por un tiempo.
          </p>
        </div>

        <div
          className={
            solaUna
              ? "mx-auto max-w-4xl"
              : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {activas.map((promo) => (
            <PromoCard key={promo.id} promo={promo} wide={solaUna} />
          ))}
        </div>
      </div>
    </section>
  );
}
