import type { Coords } from "../utils/ubicacion";

/**
 * 📍 UBICACIÓN DEL LOCAL
 * Cambia SOLO estos dos números por las coordenadas exactas de Charolas Locas.
 * (Google Maps → mantén presionado sobre el local → copia los números de arriba)
 */
export const LOCAL_COORDS: Coords = { lat: 19.64921008537192, lng: -99.16924649743758 };

/** Kilómetros (recorridos por calle) desde el local sin costo de envío. */
export const RADIO_GRATIS_KM = 2;

/** Lo que se cobra en cuanto se pasa de los km gratis. */
export const COSTO_INICIAL = 10;

/** Lo que sube por cada kilómetro (o fracción) extra después de eso. */
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
 * 2 – 3 km  → $20
 * 3 – 4 km  → $25
 * 4 – 5 km  → $30
 * …y así, +$5 por cada kilómetro extra.
 */
export const costoEnvioPorDistancia = (km: number) => {
  if (km <= RADIO_GRATIS_KM) return 0;
  const kmCobrados = Math.ceil(km - RADIO_GRATIS_KM - 1e-9);
  return COSTO_INICIAL + (kmCobrados - 1) * COSTO_POR_KM;
};

export interface RutaEnvio {
  /** Kilómetros a recorrer por calle. */
  km: number;
  costo: number;
  /** true si no se pudo trazar la ruta y se estimó la distancia. */
  aprox: boolean;
  /** Puntos [lat, lng] de la ruta para dibujarla en el mapa. */
  linea: [number, number][];
}

/** Las calles casi nunca van derecho; si no hay ruta se estima así. */
const FACTOR_CALLES = 1.3;

/**
 * Calcula la distancia POR CALLES (en moto/coche) del local al cliente
 * usando OSRM / OpenStreetMap (gratis, sin API key).
 */
export const calcularEnvioPorCalles = async (
  destino: Coords,
): Promise<RutaEnvio> => {
  const control = new AbortController();
  const timer = window.setTimeout(() => control.abort(), 8000);

  try {
    const puntos = `${LOCAL_COORDS.lng},${LOCAL_COORDS.lat};${destino.lng},${destino.lat}`;
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${puntos}?overview=full&geometries=geojson`,
      { signal: control.signal },
    );
    if (!res.ok) throw new Error("ruta");

    const data = (await res.json()) as {
      code: string;
      routes?: {
        distance: number;
        geometry: { coordinates: [number, number][] };
      }[];
    };
    const ruta = data.routes?.[0];
    if (data.code !== "Ok" || !ruta) throw new Error("ruta");

    const km = ruta.distance / 1000;
    return {
      km,
      costo: costoEnvioPorDistancia(km),
      aprox: false,
      linea: ruta.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    };
  } catch {
    const km = distanciaKm(LOCAL_COORDS, destino) * FACTOR_CALLES;
    return { km, costo: costoEnvioPorDistancia(km), aprox: true, linea: [] };
  } finally {
    window.clearTimeout(timer);
  }
};

export const formatKm = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
