import {
  Camera,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import logo from "./assets/logo-charolas-locas.png";
import { CartDrawer } from "./components/CartDrawer";
import { MenuSection } from "./components/MenuSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { ShippingSection } from "./components/ShippingSection";
import { PaymentSection } from "./components/PaymentSection";
import { ScrollToTop } from "./components/ScrollToTop";
import { useCart } from "./context/CartContext";
import { config } from "./data/config";
import { formatPrice } from "./utils/formatPrice";
import { getBusinessStatus, isWednesday } from "./utils/schedule";
import { whatsappUrl } from "./utils/whatsapp";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const status = getBusinessStatus();
  const { items, total } = useCart();

  return (
    <div className="min-h-screen bg-[#fff8fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo CHAROLAS LOCAS"
              className="h-14 w-14 rounded-2xl object-cover shadow-sm"
            />

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
            <a href="#inicio" className="font-bold text-slate-600 hover:text-pink-600">
              Inicio
            </a>
            <a href="#menu" className="font-bold text-slate-600 hover:text-pink-600">
              Menú
            </a>
            <a href="#horarios" className="font-bold text-slate-600 hover:text-pink-600">
              Horarios
            </a>
            <a href="#envios" className="font-bold text-slate-600 hover:text-pink-600">
              Envíos
            </a>
            <a href="#pago" className="font-bold text-slate-600 hover:text-pink-600">
              Pago
            </a>
            <a href="#contacto" className="font-bold text-slate-600 hover:text-pink-600">
              Contacto
            </a>
          </nav>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-pink-600"
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
              onClick={() => setMobileOpen((value) => !value)}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 md:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-pink-100 bg-white px-4 py-3 md:hidden">
            {[
              ["Inicio", "#inicio"],
              ["Menú", "#menu"],
              ["Horarios", "#horarios"],
              ["Envíos", "#envios"],
              ["Pago", "#pago"],
              ["Contacto", "#contacto"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 font-bold"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {isWednesday() && (
        <div className="bg-gradient-to-r from-pink-600 via-fuchsia-500 to-orange-400 px-4 py-3 text-center font-black text-white">
          ✨ ¡MIÉRCOLES DE PROMOCIÓN! · 20% de descuento en todas las frutas con crema.
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
                    status.open ? "bg-emerald-500" : "bg-red-500"
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
                Frutas con crema, snacks, charolas y una sección completa de Drinks.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#menu"
                  className="rounded-2xl bg-pink-600 px-6 py-4 text-center font-black text-white shadow-xl shadow-pink-200"
                >
                  Ver menú
                </a>

                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-white"
                >
                  <MessageCircle size={19} />
                  Pedir por WhatsApp
                </a>

                <a
                  href={config.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black ring-1 ring-slate-200"
                >
                  <MapPin size={19} />
                  Cómo llegar
                </a>
              </div>
            </div>

            <div className="mx-auto w-full max-w-lg rounded-[3rem] bg-gradient-to-br from-pink-500 via-fuchsia-400 to-orange-300 p-8 shadow-2xl shadow-pink-200">
              <img
                src={logo}
                alt="Logo de CHAROLAS LOCAS"
                className="aspect-square w-full rounded-[2.3rem] object-cover"
              />
            </div>
          </div>
        </section>

        <MenuSection />
        <ScheduleSection />
        <ShippingSection />
        <PaymentSection />

        <section id="contacto" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-[.22em] text-pink-600">
                Estamos cerca
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Contacta a CHAROLAS LOCAS
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Llámanos",
                  value: config.displayPhone,
                  href: `tel:${config.phone}`,
                  Icon: Phone,
                },
                {
                  label: "WhatsApp",
                  value: "Arma tu pedido",
                  href: whatsappUrl(),
                  Icon: MessageCircle,
                },
                {
                  label: "Instagram",
                  value: "@las_charolas_locas",
                  href: config.instagram,
                  Icon: Camera,
                },
                {
                  label: "Ubicación",
                  value: "Abrir Google Maps",
                  href: config.maps,
                  Icon: MapPin,
                },
              ].map(({ label, value, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-100 text-pink-600">
                    <Icon size={22} />
                  </div>

                  <p className="mt-5 text-lg font-black">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {value}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-4 py-10 text-center text-white">
        <img
          src={logo}
          alt=""
          className="mx-auto h-20 w-20 rounded-2xl object-cover"
        />
        <p className="mt-3 text-2xl font-black text-pink-400">
          CHAROLAS LOCAS
        </p>
        <p className="mt-2 text-sm text-slate-400">
          De todo, para todos.
        </p>
      </footer>

      {items.length > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl bg-slate-950 px-5 py-4 font-black text-white shadow-2xl"
        >
          <ShoppingBag size={20} />
          Ver pedido ({items.length}) · {formatPrice(total)}
        </button>
      )}

      <ScrollToTop />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
