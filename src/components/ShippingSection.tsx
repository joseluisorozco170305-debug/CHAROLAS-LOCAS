import { Clock, MapPinned, Store } from "lucide-react";
import { COSTO_POR_KM, costoFueraDeZona } from "../data/envio";
import { formatPrice } from "../utils/formatPrice";
import { BentoSection, Dots, Ilustracion, SectionHeading } from "./Bento";

const ejemplos = [2, 2.5, 3, 4, 5].map((km) => ({
  km,
  costo: costoFueraDeZona(km),
}));

export function ShippingSection() {
  return (
    <BentoSection id="envios">
      <SectionHeading
        kicker="Entregas 🛵"
        title="¿Cuánto cuesta el envío?"
        subtitle="Pide a domicilio o recoge en el local. Al marcar tu ubicación, el envío se calcula solito."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {/* Zona gratis */}
        <div className="relative col-span-2 flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-7 text-white shadow-xl shadow-pink-200 sm:p-9 lg:row-span-2">
          <Dots />
          <Ilustracion
            nombre="papas"
            className="-bottom-6 -right-4 w-40 rotate-12 sm:w-52"
          />

          <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-black uppercase tracking-wider backdrop-blur">
            <MapPinned size={14} />
            Zona rosa del mapa
          </span>

          <div className="relative max-w-xs">
            <p className="soft-heading text-5xl font-black leading-[.9] sm:text-6xl">
              Envío gratis
            </p>
            <p className="mt-3 font-semibold text-white/85">
              Si estás dentro de nuestra zona de reparto, el envío va por
              nuestra cuenta. 💕
            </p>
          </div>
        </div>

        {/* Fuera de zona */}
        <div className="col-span-2 rounded-[2rem] bg-white p-5 shadow-[0_10px_30px_rgba(236,72,153,0.10)] ring-1 ring-pink-100 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-orange-500">
                Fuera de la zona
              </p>
              <p className="soft-heading mt-1 text-3xl font-black text-rose-950">
                {formatPrice(COSTO_POR_KM)}
                <span className="text-lg text-rose-950/50"> por km</span>
              </p>
            </div>
            <p className="pb-1 text-right text-xs font-bold text-slate-400">
              medio km = {formatPrice(COSTO_POR_KM / 2)}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {ejemplos.map(({ km, costo }) => (
              <div
                key={km}
                className="rounded-xl bg-orange-50 px-1 py-2 text-center ring-1 ring-orange-100"
              >
                <p className="text-[11px] font-bold text-orange-700/70">
                  {km} km
                </p>
                <p className="font-black text-orange-700">{formatPrice(costo)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pick up */}
        <div className="flex min-h-[9.5rem] flex-col justify-between rounded-[2rem] bg-white p-5 shadow-[0_10px_30px_rgba(236,72,153,0.10)] ring-1 ring-pink-100 sm:p-6">
          <div className="flex items-start justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-100 text-pink-600">
              <Store size={22} />
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
              Gratis
            </span>
          </div>
          <div>
            <p className="soft-heading mt-4 text-xl font-black text-rose-950">
              Pick up
            </p>
            <p className="text-sm font-semibold text-slate-500">
              Recoge en el local
            </p>
          </div>
        </div>

        {/* Al momento */}
        <div className="flex min-h-[9.5rem] flex-col justify-between rounded-[2rem] bg-slate-950 p-5 text-white shadow-lg shadow-slate-300 sm:p-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-pink-300">
            <Clock size={22} />
          </span>
          <div>
            <p className="soft-heading mt-4 text-xl font-black leading-tight">
              Todo al momento
            </p>
            <p className="text-sm font-semibold text-slate-400">
              Gracias por tu paciencia
            </p>
          </div>
        </div>
      </div>
    </BentoSection>
  );
}
