const formatoFechaMexico = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Mexico_City",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Devuelve la fecha de hoy (YYYY-MM-DD) en hora de Ciudad de México. */
export const fechaMexicoISO = (fecha: Date = new Date()): string =>
  formatoFechaMexico.format(fecha);

/** ¿Hoy (hora de México) está dentro del rango [desde, hasta]? (YYYY-MM-DD) */
export const estaVigente = (desde?: string, hasta?: string): boolean => {
  const hoy = fechaMexicoISO();
  return (!desde || hoy >= desde) && (!hasta || hoy <= hasta);
};

/** Días que faltan para una fecha (0 si es hoy o ya pasó). */
export const diasRestantes = (hasta: string): number => {
  const dia = 86_400_000;
  const diff =
    Date.parse(`${hasta}T00:00:00Z`) -
    Date.parse(`${fechaMexicoISO()}T00:00:00Z`);
  return Math.max(0, Math.round(diff / dia));
};

/** "30 de noviembre" */
export const fechaLarga = (iso: string): string =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
