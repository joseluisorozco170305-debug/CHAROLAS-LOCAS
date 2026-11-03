import type { ReactNode } from "react";

/** Encabezado de sección con el estilo bento de Charolas. */
export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="soft-heading text-base font-extrabold tracking-[.08em] text-pink-500">
        {kicker}
      </p>
      <h2 className="soft-heading mt-1 text-4xl font-black leading-tight text-rose-950 sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base font-semibold text-rose-950/60">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Puntitos blancos de fondo para las tarjetas de color. */
export function Dots() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,.2) 1.4px, transparent 1.6px)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}

/** Ilustración 3D decorativa (de /public/menu-3d). */
export function Ilustracion({
  nombre,
  className,
}: {
  nombre: string;
  className: string;
}) {
  return (
    <img
      src={`/menu-3d/${nombre}.webp`}
      alt=""
      aria-hidden
      loading="lazy"
      className={`pointer-events-none absolute drop-shadow-[0_18px_22px_rgba(0,0,0,.22)] transition duration-500 ${className}`}
    />
  );
}

/** Contenedor de sección con las manchas de color de fondo. */
export function BentoSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative overflow-x-clip py-16 sm:py-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
