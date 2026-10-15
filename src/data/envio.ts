import type { Coords } from "../utils/ubicacion";

/**
 * 📍 UBICACIÓN DEL LOCAL (solo para mostrar la 🍓 en el mapa)
 */
export const LOCAL_COORDS: Coords = { lat: 19.64921008537192, lng: -99.16924649743758 };

/**
 * 🟢 ZONA DE ENVÍO GRATIS
 * Sale del mapa que dibujaste en Google My Maps (zona_gratuita.kml).
 * Son varios polígonos que juntos forman la zona. Cada punto es [lat, lng].
 * Para cambiarla: vuelve a exportar el KML y reemplaza esta lista.
 */
export const ZONA_GRATIS: [number, number][][] = [
  [[19.6537638, -99.172334], [19.6472366, -99.1690081], [19.6476408, -99.1666478], [19.6563706, -99.1646307], [19.6567545, -99.1659611], [19.6576032, -99.1696948], [19.6564918, -99.1699952], [19.6552996, -99.1704887], [19.6537638, -99.172334]],
  [[19.6563706, -99.1646307], [19.6476408, -99.1666478], [19.6499445, -99.1596096], [19.6563706, -99.1646307]],
  [[19.6430534, -99.1783851], [19.638183, -99.178943], [19.6376777, -99.1718834], [19.6401029, -99.1671413], [19.6470547, -99.1689652], [19.6471962, -99.1693943], [19.6430534, -99.1783851]],
  [[19.6499445, -99.1596096], [19.6473579, -99.1693729], [19.6401029, -99.1671413], [19.6382638, -99.1665619], [19.6382638, -99.161455], [19.6409315, -99.1587943], [19.642528, -99.1583436], [19.644367, -99.1603392], [19.6468729, -99.1595238], [19.6499445, -99.1596096]],
  [[19.6376777, -99.1718834], [19.6382064, -99.1685534], [19.6382638, -99.1665619], [19.6401029, -99.1671413], [19.6376777, -99.1718834]],
  [[19.6537638, -99.172334], [19.6498233, -99.1767114], [19.6430534, -99.1783851], [19.6472366, -99.1690081], [19.6495606, -99.1696089], [19.6537638, -99.172334]],
];

/** Precio por kilómetro de ruta (desde el local) cuando el cliente está FUERA de la zona. */
export const COSTO_POR_KM = 10;

/** Lo mínimo que se cobra si queda fuera de la zona. */
export const COSTO_MINIMO_FUERA = 10;

/**
 * Margen (en metros) alrededor de la zona que todavía cuenta como gratis,
 * por si el GPS o el pin quedan tantito movidos de la orilla.
 */
export const TOLERANCIA_M = 50;

/** Distancia en línea recta entre dos puntos, en km. */
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

/** ¿El punto está dentro del polígono? (ray casting) */
const dentroDePoligono = (p: Coords, poligono: [number, number][]) => {
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [latI, lngI] = poligono[i];
    const [latJ, lngJ] = poligono[j];
    const cruza =
      latI > p.lat !== latJ > p.lat &&
      p.lng < ((lngJ - lngI) * (p.lat - latI)) / (latJ - latI) + lngI;
    if (cruza) dentro = !dentro;
  }
  return dentro;
};

/** Distancia (km) del punto a la orilla más cercana de la zona. */
const distanciaALaZonaKm = (p: Coords) => {
  // Proyección plana alrededor del punto (suficiente para pocos km).
  const kmPorGradoLat = 111.32;
  const kmPorGradoLng = 111.32 * Math.cos((p.lat * Math.PI) / 180);
  const xy = ([lat, lng]: [number, number]) => [
    (lng - p.lng) * kmPorGradoLng,
    (lat - p.lat) * kmPorGradoLat,
  ];

  let minima = Infinity;
  for (const poligono of ZONA_GRATIS) {
    for (let i = 0; i < poligono.length - 1; i++) {
      const [ax, ay] = xy(poligono[i]);
      const [bx, by] = xy(poligono[i + 1]);
      const dx = bx - ax;
      const dy = by - ay;
      const largo2 = dx * dx + dy * dy;
      const t = largo2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / largo2)) : 0;
      minima = Math.min(minima, Math.hypot(ax + t * dx, ay + t * dy));
    }
  }
  return minima;
};

/** ¿El punto cae dentro de la zona gratis (con el margen)? */
export const dentroDeZonaGratis = (p: Coords) =>
  ZONA_GRATIS.some((poligono) => dentroDePoligono(p, poligono)) ||
  distanciaALaZonaKm(p) <= TOLERANCIA_M / 1000;

/**
 * Redondeo de los km de ruta a medio kilómetro:
 *   2.0 – 2.4 → 2 km    ($20)
 *   2.5 – 2.6 → 2.5 km  ($25)
 *   2.7 – 2.9 → 3 km    ($30)
 */
export const kmCobrables = (km: number) => {
  const conDecimal = Math.round(km * 10) / 10;
  const entero = Math.floor(conDecimal);
  const decimal = Math.round((conDecimal - entero) * 10);
  if (decimal >= 7) return entero + 1;
  if (decimal >= 5) return entero + 0.5;
  return entero;
};

export const costoFueraDeZona = (kmRuta: number) =>
  Math.max(COSTO_MINIMO_FUERA, kmCobrables(kmRuta) * COSTO_POR_KM);

export interface RutaEnvio {
  /** Kilómetros de ruta por calle desde el local. */
  km: number;
  /** true si el cliente está dentro de la zona gratis. */
  dentro: boolean;
  costo: number;
  /** true si no se pudo trazar la ruta y se estimó la distancia. */
  aprox: boolean;
  /** Puntos [lat, lng] de la ruta para dibujarla en el mapa. */
  linea: [number, number][];
}

/** Las calles casi nunca van derecho; si no hay ruta se estima así. */
const FACTOR_CALLES = 1.3;

/**
 * Traza la ruta POR CALLES del local al cliente (OSRM / OpenStreetMap,
 * gratis, sin API key) y calcula el envío:
 *  - dentro de la zona gratis → $0
 *  - fuera → $10 por km de ruta (redondeado a medio km)
 */
export const calcularEnvioPorCalles = async (
  destino: Coords,
): Promise<RutaEnvio> => {
  const dentro = dentroDeZonaGratis(destino);
  const resultado = (km: number, aprox: boolean, linea: [number, number][]) => ({
    km,
    dentro,
    costo: dentro ? 0 : costoFueraDeZona(km),
    aprox,
    linea,
  });

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

    return resultado(
      ruta.distance / 1000,
      false,
      ruta.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    );
  } catch {
    return resultado(distanciaKm(LOCAL_COORDS, destino) * FACTOR_CALLES, true, []);
  } finally {
    window.clearTimeout(timer);
  }
};

export const formatKm = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
