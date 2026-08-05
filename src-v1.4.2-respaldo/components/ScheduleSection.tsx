import { Clock } from "lucide-react";
import { horarios } from "../data/horarios";

const labels = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
} as const;

const order: (keyof typeof horarios)[] = [
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
  const date = new Date(2000, 0, 1, hour, minute);

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export function ScheduleSection() {
  const currentDay = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    weekday: "long",
  }).format(new Date()) as keyof typeof horarios;

  return (
    <section id="horarios" className="bg-pink-50/70 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink-600 text-white shadow-lg shadow-pink-200">
            <Clock size={26} />
          </div>

          <p className="mt-5 text-sm font-black uppercase tracking-[.22em] text-pink-600">
            Horarios
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Visítanos esta semana
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl shadow-pink-100/60">
          {order.map((day) => {
            const entry = horarios[day];
            const today = day === currentDay;

            return (
              <div
                key={day}
                className={`flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:px-7 ${
                  today ? "bg-pink-50" : ""
                }`}
              >
                <strong className={today ? "text-pink-700" : "text-slate-800"}>
                  {labels[day]}
                  {today ? " · Hoy" : ""}
                </strong>

                <span className="text-right text-sm font-bold text-slate-600">
                  {entry.closed || !entry.open || !entry.close
                    ? "Cerrado"
                    : `${formatHour(entry.open)} – ${formatHour(entry.close)}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
