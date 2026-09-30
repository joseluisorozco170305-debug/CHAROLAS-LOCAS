import { Sparkles } from "lucide-react";
import { isWednesday } from "../utils/schedule";

/** Banner de la promo de los miércoles (solo se muestra ese día). */
export function WednesdayBanner() {
  if (!isWednesday()) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-fuchsia-600 to-orange-500 text-white">
      <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 right-10 h-44 w-44 rounded-full bg-yellow-300/25 blur-2xl" />
      <span className="pointer-events-none absolute left-[8%] top-3 text-lg opacity-70">✨</span>
      <span className="pointer-events-none absolute right-[10%] top-4 text-lg opacity-70">🍓</span>
      <span className="pointer-events-none absolute bottom-2 left-[30%] hidden text-base opacity-60 sm:block">💗</span>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:px-6 sm:text-left lg:px-8">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
          <div className="grid h-16 w-16 shrink-0 rotate-[-6deg] place-items-center rounded-2xl bg-white text-center shadow-lg shadow-fuchsia-900/20">
            <div className="leading-none">
              <p className="text-2xl font-black text-pink-600">20%</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                OFF
              </p>
            </div>
          </div>

          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[.24em] text-yellow-200">
              <Sparkles size={13} />
              Miércoles de promo
            </p>
            <p className="mt-0.5 text-xl font-black leading-tight sm:text-2xl">
              20% de descuento en todo con crema
            </p>
            <p className="mt-0.5 text-xs font-semibold text-white/80">
              El descuento aplica al producto · los extras se cobran a precio
              normal · Solo hoy
            </p>
          </div>
        </div>

        <a
          href="#menu"
          className="shrink-0 rounded-2xl bg-white px-5 py-3 text-sm font-black text-pink-600 shadow-lg shadow-fuchsia-900/20 transition hover:-translate-y-0.5 hover:bg-yellow-50"
        >
          Aprovechar ahora
        </a>
      </div>
    </div>
  );
}
