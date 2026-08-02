import { config } from "../data/config";
import { horarios } from "../data/horarios";

type Day = keyof typeof horarios;

const nowParts = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: config.timezone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const day = parts.find((part) => part.type === "weekday")?.value as Day;
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return { day, minutes: hour * 60 + minute };
};

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

export const getBusinessStatus = () => {
  const { day, minutes } = nowParts();
  const entry = horarios[day];

  if (entry.closed || !entry.open || !entry.close) {
    return { open: false, text: "Cerrado" };
  }

  const open = toMinutes(entry.open);
  const close = toMinutes(entry.close);

  if (minutes >= open && minutes < close) {
    return { open: true, text: "Abierto ahora" };
  }

  if (minutes < open) {
    return { open: false, text: `Abre hoy a las ${entry.open}` };
  }

  return { open: false, text: "Cerrado por hoy" };
};

export const isWednesday = () => nowParts().day === "Wednesday";
