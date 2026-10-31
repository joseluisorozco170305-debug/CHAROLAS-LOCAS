import {
  ArrowRight,
  Camera,
  CreditCard,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import logo from "./assets/logo-charolas-locas.png";
import { PromoSection } from "./components/PromoSection";
import { WednesdayBanner } from "./components/WednesdayBanner";
import { promosVigentes } from "./data/promos";
import { CartDrawer } from "./components/CartDrawer";
import { MenuSection } from "./components/MenuSection";
import { FirstTimeSection } from "./components/FirstTimeSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { ShippingSection } from "./components/ShippingSection";
import { PaymentSection } from "./components/PaymentSection";
import { ScrollToTop } from "./components/ScrollToTop";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { AddToCartToast } from "./components/AddToCartToast";
import { useCart } from "./context/CartContext";
import { config } from "./data/config";
import { formatPrice } from "./utils/formatPrice";
import { getBusinessStatus } from "./utils/schedule";
import { whatsappUrl } from "./utils/whatsapp";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const status = getBusinessStatus();
  const hayPromos = promosVigentes().length > 0;
  const { items, total } = useCart();

  return (
    <div className="min-h-screen bg-[#fff8fb] pb-20 text-slate-900 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Charolas Locas, ir al inicio">
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
            {hayPromos && (
              <a href="#promos" className="font-bold text-orange-500 hover:text-pink-600">
                Promos
              </a>
            )}
            <a href="#horarios" className="font-bold text-slate-600 hover:text-pink-600">
              Horarios
            </a>
            <a href="#envios" className="font-bold text-slate-600 hover:text-pink-600">
              Envíos
            </a>
            <a href="#contacto" className="font-bold text-slate-600 hover:text-pink-600">
              Contacto
            </a>
          </nav>

          <div className="flex gap-2">
            <a
              href="#pago"
              className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 font-black text-white transition hover:bg-pink-600 sm:inline-flex"
            >
              <CreditCard size={18} />
              Datos de pago
            </a>

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
              ["💳 Datos de pago", "#pago"],
              ...(hayPromos ? [["Promos", "#promos"]] : []),
              ["Horarios", "#horarios"],
              ["Envíos", "#envios"],
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

      <WednesdayBanner />

      <main>
        <section id="inicio" className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-pink-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:min-h-[640px] lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-8 lg:py-20">
            <div className="text-center lg:text-left">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ring-1 ${
                  status.open
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-red-50 text-red-700 ring-red-200"
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  {status.open && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      status.open ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                </span>
                {status.text}
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[.92] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Tus antojos se ponen
                <span className="block bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text pb-2 text-transparent">
                  más locos.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
                Frutas con crema, snacks, charolas y una sección completa de Drinks.
              </p>

              <div className="mt-8 grid gap-3 sm:mx-auto sm:max-w-md sm:grid-cols-2 lg:mx-0">
                <a
                  href="#menu"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-4 font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-700"
                >
                  <UtensilsCrossed size={19} />
                  Ver menú
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </a>

                <a
                  href={config.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-900 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-pink-300"
                >
                  <MapPin size={19} className="text-pink-600" />
                  Ver ubicación
                </a>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-slate-500 lg:justify-start">
                <span>🍓 Dulce</span>
                <span>🌶️ Salado</span>
                <span>🛵 Envío a domicilio</span>
                <span>🏪 Pick up</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <div className="absolute -inset-3 rotate-3 rounded-[3rem] bg-gradient-to-br from-pink-500 via-fuchsia-400 to-orange-300 opacity-90" />

              <div className="relative overflow-hidden rounded-[2.6rem] border-[6px] border-white bg-pink-100 shadow-2xl shadow-pink-300/50">
                <video
                  className="aspect-[4/5] w-full object-cover"
                  src="/videos/hero-charolas.mp4"
                  poster="/videos/hero-poster.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Algunos de los productos de CHAROLAS LOCAS"
                />
              </div>

              <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-pink-200/60 ring-1 ring-pink-100 sm:-left-8">
                <p className="text-[11px] font-black uppercase tracking-[.18em] text-orange-500">
                  Hecho al momento
                </p>
                <p className="font-black text-slate-900">De todo, para todos 💕</p>
              </div>
            </div>
          </div>
        </section>

        <PromoSection />
        <FirstTimeSection />
        <MenuSection />
        <PaymentSection />
        <ScheduleSection />
        <ShippingSection />

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
          className="fixed bottom-24 left-1/2 z-40 md:bottom-5 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl bg-slate-950 px-5 py-4 font-black text-white shadow-2xl"
        >
          <ShoppingBag size={20} />
          Ver pedido ({items.length}) · {formatPrice(total)}
        </button>
      )}

      <AddToCartToast />
      <ScrollToTop />
      <MobileBottomNav onOpenCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
