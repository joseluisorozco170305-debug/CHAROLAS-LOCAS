import {
  CheckCircle2,
  ChevronDown,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "Explora el menú",
    text: "Descubre frutas, snacks, charolas y drinks.",
    Icon: Sparkles,
  },
  {
    title: "Personaliza tus productos",
    text: "Elige tamaños, sabores, toppings e ingredientes.",
    Icon: ShoppingBag,
  },
  {
    title: "Envía tu pedido por WhatsApp",
    text: "Revisa el resumen y envíalo con un toque.",
    Icon: MessageCircle,
  },
  {
    title: "Elige cómo recibirlo",
    text: "Selecciona envío a domicilio o Pick up para recoger.",
    Icon: MapPin,
  },
  {
    title: "Recibe y disfruta",
    text: "Preparamos tu pedido al momento.",
    Icon: CheckCircle2,
  },
];

export function FirstTimeSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-orange-50 shadow-xl shadow-pink-100/60">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-4 p-6 text-left sm:p-8"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-pink-600 text-white shadow-lg shadow-pink-200">
                <Sparkles size={24} />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[.18em] text-pink-600">
                  ¿Es tu primera vez?
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                  Toca aquí para saber cómo hacer tu pedido
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Te explicamos el proceso en cinco pasos.
                </p>
              </div>
            </div>

            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-pink-600 shadow-sm transition ${
                open ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={22} />
            </div>
          </button>

          {open && (
            <div className="border-t border-pink-100 px-6 pb-8 pt-6 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {steps.map(({ title, text, Icon }, index) => (
                  <article
                    key={title}
                    className="relative rounded-3xl border border-white bg-white/90 p-5 shadow-sm"
                  >
                    <div className="absolute right-4 top-4 text-sm font-black text-pink-300">
                      {index + 1}
                    </div>

                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-100 text-pink-600">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-4 font-black text-slate-900">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center rounded-2xl bg-pink-600 px-6 py-4 font-black text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-700"
                >
                  Ver menú
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
