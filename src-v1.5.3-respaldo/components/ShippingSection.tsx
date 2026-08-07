import { MapPin, ShoppingBag, Truck } from "lucide-react";
import { shippingZones } from "../data/envios";

export function ShippingSection() {
  return (
    <section id="envios" className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">
            <Truck size={26} />
          </div>

          <p className="mt-5 text-sm font-black uppercase tracking-[.22em] text-orange-500">
            Entregas
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Costos de envío
          </h2>

          <p className="mt-3 text-slate-600">
            Puedes pedir envío a domicilio o seleccionar Pick up para recoger
            tu pedido directamente en el local.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-pink-100 bg-pink-50/40 shadow-xl shadow-pink-100/50">
          {shippingZones.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-4 px-5 py-4 sm:px-7 ${
                index !== shippingZones.length - 1
                  ? "border-b border-pink-100"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-pink-600 shadow-sm">
                  {item.id === "pickup" ? (
                    <ShoppingBag size={18} />
                  ) : (
                    <MapPin size={18} />
                  )}
                </div>

                <strong className="text-slate-800">{item.zone}</strong>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-black ${
                  item.cost === 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-white text-pink-700 ring-1 ring-pink-100"
                }`}
              >
                {item.displayCost}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-orange-50 p-4 text-center text-sm font-semibold text-orange-800">
          En envíos a domicilio, los precios mostrados son aproximados y el
          costo final se confirma después de recibir la ubicación exacta.
          Pick up no tiene costo de envío.
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-slate-500">
          Todas nuestras charolas se elaboran al momento. Agradecemos tu paciencia.
        </p>
      </div>
    </section>
  );
}
