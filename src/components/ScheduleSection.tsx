import { Clock } from "lucide-react";
import { horarios } from "../data/horarios";
import { getBusinessStatus } from "../utils/schedule";
import { BentoSection, Dots, Ilustracion, SectionHeading } from "./Bento";

type Day = keyof typeof horarios;

const labels: Record<Day, string> = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

const order: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatHour = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2000, 0, 1, hour, minute));
};

const rango = (day: Day) => {
  const entry = horarios[day];
  return entry.closed || !entry.open || !entry.close
    ? null
    : `${formatHour(entry.open)} – ${formatHour(entry.close)}`;
};

/** Próximo día (a partir de mañana) que abrimos. */
const proximaApertura = (hoy: Day) => {
  const i = order.indexOf(hoy);
  for (let paso = 1; paso <= 7; paso++) {
    const day = order[(i + paso) % 7];
    const entry = horarios[day];
    if (!entry.closed && entry.open) {
      return `${paso === 1 ? "mañana" : `el ${labels[day].toLowerCase()}`} a las ${formatHour(entry.open)}`;
    }
  }
  return null;
};

export function ScheduleSection() {
  const currentDay = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    weekday: "long",
  }).format(new Date()) as Day;

  const status = getBusinessStatus();
  const hoy = rango(currentDay);
  const yaAbrioHoy = status.text.startsWith("Abre hoy");

  return (
    <BentoSection id="horarios">
      <SectionHeading kicker="Horarios ⏰" title="¿Cuándo nos visitas?" />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Estado de hoy */}
        <div
          className={`relative flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-[2rem] p-7 text-white shadow-xl sm:p-9 ${
            status.open
              ? "bg-gradient-to-br from-pink-600 via-rose-500 to-orange-400 shadow-pink-200"
              : "bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 shadow-slate-300"
          }`}
        >
          <Dots />
          <Ilustracion
            nombre={status.open ? "helado" : "dona"}
            className="-bottom-6 -right-4 w-40 rotate-12 sm:w-52"
          />

          <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-black uppercase tracking-wider backdrop-blur">
            <span className="relative flex h-2 w-2">
              {status.open && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Hoy · {labels[currentDay]}
          </span>

          <div className="relative max-w-xs">
            <p className="soft-heading text-4xl font-black leading-[.95] sm:text-5xl">
              {status.open
                ? "¡Estamos abiertos!"
                : yaAbrioHoy
                  ? "Abrimos más tarde"
                  : "Ahorita estamos cerrados"}
            </p>
            <p className="mt-3 font-semibold text-white/85">
              {status.open
                ? `Hoy de ${hoy} · ¡Pásate o pide a domicilio!`
                : yaAbrioHoy && hoy
                  ? `Hoy abrimos de ${hoy}`
                  : `Abrimos ${proximaApertura(currentDay) ?? "pronto"} 💕`}
            </p>
          </div>
        </div>

        {/* Semana */}
        <div className="rounded-[2rem] bg-white p-3 shadow-[0_10px_30px_rgba(236,72,153,0.10)] ring-1 ring-pink-100 sm:p-4">
          <div className="flex items-center gap-2 px-3 pb-2 pt-2">
            <Clock size={16} className="text-pink-500" />
            <p className="text-xs font-black uppercase tracking-[.18em] text-pink-500">
              Toda la semana
            </p>
          </div>

          <ul>
            {order.map((day) => {
              const horas = rango(day);
              const esHoy = day === currentDay;

              return (
                <li
                  key={day}
                  className={`flex items-center justify-between gap-4 rounded-2xl px-3 py-2.5 ${
                    esHoy ? "bg-pink-50 ring-1 ring-pink-200" : ""
                  }`}
                >
                  <span
                    className={`soft-heading font-extrabold ${
                      esHoy ? "text-pink-600" : "text-rose-950"
                    }`}
                  >
                    {labels[day]}
                    {esHoy && (
                      <span className="ml-2 rounded-full bg-pink-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                        Hoy
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      horas ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {horas ?? "Descansamos 😴"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </BentoSection>
  );
}
