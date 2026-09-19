const formatoFechaMexico = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Mexico_City",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Devuelve la fecha de hoy (YYYY-MM-DD) en hora de Ciudad de México. */
export const fechaMexicoISO = (fecha: Date = new Date()): string =>
  formatoFechaMexico.format(fecha);
