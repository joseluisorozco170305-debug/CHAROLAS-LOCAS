import {
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

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
    title: "Comparte tu ubicación",
    text: "Confirma con nosotros el costo exacto de envío.",
    Icon: MapPin,
  },
  {
    title: "Recibe y disfruta",
    text: "Preparamos tu pedido al momento.",
    Icon: CheckCircle2,
  },
];

export function FirstTimeSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-orange-50 p-6 shadow-xl shadow-pink-100/60 sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[.22em] text-pink-600">
              ¿Es tu primera vez?
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Pedir en CHAROLAS LOCAS es muy fácil
            </h2>

            <p className="mt-3 text-slate-600">
              Sigue estos pasos y arma tu pedido en pocos minutos.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

                <h3 className="mt-4 font-black text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
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
      </div>
    </section>
  );
}
