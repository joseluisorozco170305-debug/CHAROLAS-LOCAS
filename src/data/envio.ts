import type { Coords } from "../utils/ubicacion";

/**
 * 📍 UBICACIÓN DEL LOCAL
 * Cambia SOLO estos dos números por las coordenadas exactas de Charolas Locas.
 * (Google Maps → mantén presionado sobre el local → copia los números de arriba)
 */
export const LOCAL_COORDS: Coords = { lat: 19.6714, lng: -99.1783 };

/** Radio (km) alrededor del local sin costo de envío. */
export const RADIO_GRATIS_KM = 2;

/** Lo que se cobra por cada kilómetro (o fracción) después del radio gratis. */
export const COSTO_POR_KM = 5;

/** Distancia en línea recta ("a la redonda") entre dos puntos, en km. */
export const distanciaKm = (a: Coords, b: Coords) => {
  const R = 6371;
  const rad = (grados: number) => (grados * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
};

/**
 * 0 – 2 km  → $0
 * 2 – 3 km  → $5
 * 3 – 4 km  → $10
 * …y así, +$5 por cada kilómetro extra.
 */
export const costoEnvioPorDistancia = (km: number) =>
  km <= RADIO_GRATIS_KM
    ? 0
    : Math.ceil(km - RADIO_GRATIS_KM - 1e-9) * COSTO_POR_KM;

export const calcularEnvio = (destino: Coords) => {
  const km = distanciaKm(LOCAL_COORDS, destino);
  return { km, costo: costoEnvioPorDistancia(km) };
};

export const formatKm = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
