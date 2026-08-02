import {
  Camera,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { MenuSection } from "./components/menu/MenuSection";       
import { config } from "./data/config";
import { useCart } from "./context/CartContext";
import {
  getBusinessStatus,
  isWednesday,
} from "./utils/schedule";
import { whatsappUrl } from "./utils/whatsapp";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const status = getBusinessStatus();
  const { items, total } = useCart();

  return (
    <div className="min-h-screen bg-[#fff8fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 text-xl shadow-lg shadow-pink-200">
              🍓
            </div>

            <div>
              <p className="font-black leading-none text-pink-600">
                CHAROLAS
              </p>

              <p className="font-black leading-none text-orange-500">
                LOCAS
              </p>
            </div>
          </a>

          <nav className="hidden gap-7 md:flex">
            <a
              href="#inicio"
              className="font-bold text-slate-600 transition hover:text-pink-600"
            >
              Inicio
            </a>

            <a
              href="#menu"
              className="font-bold text-slate-600 transition hover:text-pink-600"
            >
              Menú
            </a>

            <a
              href="#contacto"
              className="font-bold text-slate-600 transition hover:text-pink-600"
            >
              Contacto
            </a>
          </nav>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Abrir carrito"
              className="relative grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-600 transition hover:bg-pink-100"
            >
              <ShoppingBag size={21} />

              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1.5 text-xs font-black text-white">
                  {items.length}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Abrir navegación"
              className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-pink-100 bg-white px-4 py-3 md:hidden">
            <a
              className="block rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-pink-50"
              href="#inicio"
              onClick={() => setMobileOpen(false)}
            >
              Inicio
            </a>

            <a
              className="block rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-pink-50"
              href="#menu"
              onClick={() => setMobileOpen(false)}
            >
              Menú
            </a>

            <a
              className="block rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-pink-50"
              href="#contacto"
              onClick={() => setMobileOpen(false)}
            >
              Contacto
            </a>
          </nav>
        )}
      </header>

      {isWednesday() && (
        <div className="bg-gradient-to-r from-pink-600 via-fuchsia-500 to-orange-400 px-4 py-3 text-center font-black text-white">
          ✨ ¡MIÉRCOLES DE PROMOCIÓN! · 20% de descuento en todas las
          frutas con crema.
        </div>
      )}

      <main>
        <section id="inicio" className="relative overflow-hidden">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />

          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl" />

          <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ring-1 ${
                  status.open
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-red-50 text-red-700 ring-red-200"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    status.open
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                />

                {status.text}
              </span>

              <p className="mt-7 text-sm font-black uppercase tracking-[.24em] text-orange-500">
                Dulce · Salado · Completamente loco
              </p>

              <h1 className="mt-4 text-5xl font-black leading-[.95] tracking-tight sm:text-6xl lg:text-7xl">
                Tus antojos se ponen

                <span className="block bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                  más locos.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Las charolas más deliciosas, preparadas con mucho sabor y
                listas para compartir.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#menu"
                  className="rounded-2xl bg-pink-600 px-6 py-4 text-center font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-700"
                >
                  Ver menú
                </a>

                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
                >
                  <MessageCircle size={19} />

                  Pedir por WhatsApp
                </a>

                <a
                  href={config.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-pink-300"
                >
                  <MapPin size={19} />

                  Cómo llegar
                </a>
              </div>
            </div>

            <div className="mx-auto w-full max-w-lg">
              <div className="grid aspect-square place-items-center rounded-[3rem] bg-gradient-to-br from-pink-500 via-fuchsia-400 to-orange-300 p-8 shadow-2xl shadow-pink-200">
                <div className="grid h-full w-full place-items-center rounded-[2.3rem] border border-white/30 bg-white/20 text-center text-white backdrop-blur">
                  <div>
                    <div className="text-8xl">🍓</div>

                    <p className="mt-5 text-4xl font-black">
                      CHAROLAS
                    </p>

                    <p className="text-4xl font-black text-yellow-200">
                      LOCAS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MenuSection />

        <section id="contacto" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-sm font-black uppercase tracking-[.22em] text-pink-600">
                Estamos cerca
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Contacta a CHAROLAS LOCAS
              </h2>

              <p className="mt-3 text-slate-600">
                Haz tu pedido, visita nuestro Instagram o encuentra la ruta
                para llegar.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href={`tel:${config.phone}`}
                className="rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-100 text-pink-600">
                  <Phone size={22} />
                </div>

                <p className="mt-5 text-lg font-black">
                  Llámanos
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {config.displayPhone}
                </p>
              </a>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <MessageCircle size={22} />
                </div>

                <p className="mt-5 text-lg font-black">
                  WhatsApp
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Arma y envía tu pedido
                </p>
              </a>

              <a
                href={config.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-100 text-pink-600">
                  <Camera size={22} />
                </div>

                <p className="mt-5 text-lg font-black">
                  Instagram
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  @las_charolas_locas
                </p>
              </a>

              <a
                href={config.maps}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                  <MapPin size={22} />
                </div>

                <p className="mt-5 text-lg font-black">
                  Ubicación
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Abrir Google Maps
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-4 py-10 text-center text-white">
        <p className="text-2xl font-black text-pink-400">
          CHAROLAS LOCAS
        </p>

        <p className="mt-3 text-sm text-slate-400">
          Gracias por elegirnos ❤️
        </p>
      </footer>

      {items.length > 0 && (
        <button
          type="button"
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl bg-slate-950 px-5 py-4 font-black text-white shadow-2xl"
        >
          <ShoppingBag size={20} />

          Ver pedido ({items.length}) · ${total}
        </button>
      )}
    </div>
  );
}

export default App;