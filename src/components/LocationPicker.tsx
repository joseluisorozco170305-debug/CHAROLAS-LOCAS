import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Check,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Navigation,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LOCAL_COORDS, ZONA_GRATIS } from "../data/envio";
import type { Coords } from "../utils/ubicacion";

/* ------------------------------------------------------------------ */
/* Búsqueda de direcciones (gratis, sin API key)                       */
/*  1) Photon (rápido, sirve para autocompletar)                       */
/*  2) Nominatim (respaldo)                                            */
/* ------------------------------------------------------------------ */

interface Sugerencia {
  id: string;
  titulo: string;
  detalle: string;
  lat: number;
  lng: number;
}

/** Caja de búsqueda alrededor del local (~35 km). */
const D = 0.32;
const CAJA = {
  oeste: LOCAL_COORDS.lng - D,
  sur: LOCAL_COORDS.lat - D,
  este: LOCAL_COORDS.lng + D,
  norte: LOCAL_COORDS.lat + D,
};

const unir = (...partes: (string | undefined | null)[]) =>
  partes.filter((p) => p && p.trim()).join(", ");

const buscarPhoton = async (
  texto: string,
  signal: AbortSignal,
): Promise<Sugerencia[]> => {
  const params = new URLSearchParams({
    q: texto,
    lat: String(LOCAL_COORDS.lat),
    lon: String(LOCAL_COORDS.lng),
    limit: "7",
    bbox: [CAJA.oeste, CAJA.sur, CAJA.este, CAJA.norte].join(","),
  });
  const res = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
  if (!res.ok) throw new Error("photon");

  const data = (await res.json()) as {
    features: {
      geometry: { coordinates: [number, number] };
      properties: Record<string, string | undefined>;
    }[];
  };

  return data.features
    .filter((f) => !f.properties.countrycode || f.properties.countrycode === "MX")
    .map((f, i) => {
      const p = f.properties;
      const calle = unir(p.street && `${p.street}${p.housenumber ? ` ${p.housenumber}` : ""}`);
      const titulo = p.name || calle || p.district || p.city || "Lugar";
      return {
        id: `p-${p.osm_type}-${p.osm_id}-${i}`,
        titulo,
        detalle: unir(
          p.name && calle ? calle : null,
          p.district || p.locality,
          p.city || p.county,
          p.state,
        ),
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
      };
    });
};

const buscarNominatim = async (
  texto: string,
  signal: AbortSignal,
): Promise<Sugerencia[]> => {
  const params = new URLSearchParams({
    q: texto,
    format: "jsonv2",
    countrycodes: "mx",
    limit: "6",
    "accept-language": "es",
    viewbox: [CAJA.oeste, CAJA.norte, CAJA.este, CAJA.sur].join(","),
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { signal },
  );
  if (!res.ok) throw new Error("nominatim");

  const data = (await res.json()) as {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
  }[];

  return data.map((r) => {
    const [titulo, ...resto] = r.display_name.split(", ");
    return {
      id: `n-${r.place_id}`,
      titulo,
      detalle: resto.slice(0, 3).join(", "),
      lat: Number(r.lat),
      lng: Number(r.lon),
    };
  });
};

const buscarDirecciones = async (texto: string, signal: AbortSignal) => {
  try {
    const r = await buscarPhoton(texto, signal);
    if (r.length) return r;
  } catch (e) {
    if (signal.aborted) throw e;
  }
  return buscarNominatim(texto, signal);
};

/** Dirección aproximada del pin (para que el cliente confirme y para el mensaje). */
const direccionDe = async (c: Coords, signal: AbortSignal) => {
  try {
    const params = new URLSearchParams({
      lat: String(c.lat),
      lon: String(c.lng),
      format: "jsonv2",
      zoom: "18",
      addressdetails: "1",
      "accept-language": "es",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      { signal },
    );
    if (!res.ok) throw new Error("reverse");
    const { address: a } = (await res.json()) as {
      address?: Record<string, string>;
    };
    if (!a) return null;
    return (
      unir(
        a.road && `${a.road}${a.house_number ? ` ${a.house_number}` : ""}`,
        a.neighbourhood || a.quarter || a.suburb || a.hamlet,
        a.city || a.town || a.village || a.municipality,
      ) || null
    );
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* Mapas base                                                          */
/* ------------------------------------------------------------------ */

const crearCapaCalles = () =>
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  });

/** Respaldo si los mosaicos principales fallan. */
const crearCapaCallesRespaldo = () =>
  L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
    subdomains: "abc",
    maxZoom: 19,
    attribution: "© OpenStreetMap France",
  });

/** Vista satélite + nombres de calles encima. */
const crearCapaSatelite = () =>
  L.layerGroup([
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, maxNativeZoom: 18, attribution: "Imágenes © Esri" },
    ),
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, maxNativeZoom: 18, opacity: 0.85 },
    ),
  ]);

const localIcon = L.divIcon({
  className: "",
  html: '<div style="font-size:26px;line-height:26px;transform:translate(-50%,-50%);filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">🍓</div>',
  iconSize: [0, 0],
});

/** ¿Está en el navegador interno de Instagram/Facebook/TikTok? Ahí el GPS suele fallar. */
const enNavegadorDeRedes = () =>
  typeof navigator !== "undefined" &&
  /Instagram|FBAN|FBAV|FB_IAB|Messenger|TikTok|musical_ly/i.test(
    navigator.userAgent,
  );

const mismoPunto = (a: Coords | null, b: Coords) =>
  !!a && Math.abs(a.lat - b.lat) < 0.000005 && Math.abs(a.lng - b.lng) < 0.000005;

/* ------------------------------------------------------------------ */

interface LocationPickerProps {
  value: Coords | null;
  onChange: (coords: Coords | null) => void;
  /** Ruta por calles del local al cliente, para dibujarla. */
  ruta?: [number, number][];
  /** Dirección aproximada del pin (o null si no se pudo saber). */
  onAddress?: (direccion: string | null) => void;
}

const DEFAULT_CENTER: [number, number] = [LOCAL_COORDS.lat, LOCAL_COORDS.lng];

/**
 * Selector de ubicación tipo apps de delivery: el pin se queda fijo en el
 * centro y el cliente mueve el mapa debajo hasta dejarlo justo en su casa.
 */
export function LocationPicker({
  value,
  onChange,
  ruta,
  onAddress,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const callesRef = useRef<L.TileLayer | null>(null);
  const sateliteRef = useRef<L.LayerGroup | null>(null);
  const rutaRef = useRef<L.Polyline | null>(null);
  const precisionRef = useRef<L.Circle | null>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onAddressRef = useRef(onAddress);
  /** Mientras el GPS está afinando no se toman los movimientos del mapa. */
  const gpsActivoRef = useRef(false);
  const watchRef = useRef<number | null>(null);

  const [moviendo, setMoviendo] = useState(false);
  const [locating, setLocating] = useState(false);
  const [precision, setPrecision] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [sugerencias, setSugerencias] = useState<Sugerencia[] | null>(null);
  const [dirInfo, setDirInfo] = useState<{
    clave: string;
    texto: string | null;
  } | null>(null);
  const [satelite, setSatelite] = useState(false);
  const [grande, setGrande] = useState(false);
  const redes = enNavegadorDeRedes();
  const clavePin = value ? `${value.lat.toFixed(6)},${value.lng.toFixed(6)}` : null;
  const direccion = dirInfo && dirInfo.clave === clavePin ? dirInfo.texto : null;
  const buscandoDireccion = !!clavePin && dirInfo?.clave !== clavePin;

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
    onAddressRef.current = onAddress;
  });

  const quitarPrecision = () => {
    precisionRef.current?.remove();
    precisionRef.current = null;
    setPrecision(null);
  };

  const detenerGPS = () => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    gpsActivoRef.current = false;
    setLocating(false);
  };

  /** Mueve el mapa a un punto y lo deja como ubicación elegida. */
  const irA = (c: Coords, zoom = 18) => {
    valueRef.current = c;
    onChangeRef.current(c);
    mapRef.current?.setView([c.lat, c.lng], zoom, { animate: true });
  };

  /* ---------------- Crear el mapa ---------------- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: value ? [value.lat, value.lng] : DEFAULT_CENTER,
      zoom: value ? 18 : 15,
      zoomControl: false,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);

    let calles = crearCapaCalles().addTo(map);
    let errores = 0;
    calles.on("tileerror", () => {
      errores += 1;
      if (errores === 6 && map.hasLayer(calles)) {
        map.removeLayer(calles);
        calles = crearCapaCallesRespaldo().addTo(map);
        callesRef.current = calles;
      }
    });
    callesRef.current = calles;
    sateliteRef.current = crearCapaSatelite();

    L.polygon(
      ZONA_GRATIS.map((poligono) => [poligono]),
      {
        stroke: false,
        fillColor: "#f472b6",
        fillOpacity: 0.22,
        fillRule: "nonzero",
        interactive: false,
      },
    ).addTo(map);

    L.marker(DEFAULT_CENTER, { icon: localIcon, interactive: false }).addTo(map);

    map.on("movestart", () => setMoviendo(true));
    map.on("dragstart", () => {
      // Si el cliente mueve el mapa, manda él (se cancela el GPS).
      map.getContainer().dataset.activo = "1";
      if (gpsActivoRef.current) detenerGPS();
      quitarPrecision();
    });
    map.on("moveend", () => {
      setMoviendo(false);
      if (gpsActivoRef.current) return;
      const c = map.getCenter();
      const coords = { lat: c.lat, lng: c.lng };
      if (mismoPunto(valueRef.current, coords)) return;
      // Solo cuenta si ya empezó a elegir (movió el mapa o tocó).
      if (!valueRef.current && !map.getContainer().dataset.activo) return;
      valueRef.current = coords;
      onChangeRef.current(coords);
    });
    // Tocar el mapa centra el pin en ese punto.
    map.on("click", (event: L.LeafletMouseEvent) => {
      map.getContainer().dataset.activo = "1";
      quitarPrecision();
      map.panTo(event.latlng);
    });

    // Recalcula el tamaño cuando el modal termina de abrir o cambia de alto.
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    mapRef.current = map;

    return () => {
      observer.disconnect();
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
      map.remove();
      mapRef.current = null;
      rutaRef.current = null;
      precisionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Calles / satélite ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    const calles = callesRef.current;
    const sat = sateliteRef.current;
    if (!map || !calles || !sat) return;

    if (satelite) {
      map.removeLayer(calles);
      sat.addTo(map);
    } else {
      map.removeLayer(sat);
      calles.addTo(map);
    }
  }, [satelite]);

  /* ---------------- Ruta ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    rutaRef.current?.remove();
    rutaRef.current = null;

    if (ruta && ruta.length > 1) {
      rutaRef.current = L.polyline(ruta, {
        color: "#db2777",
        weight: 5,
        opacity: 0.75,
        interactive: false,
      }).addTo(map);
    }
  }, [ruta]);

  /* ---------------- Dirección del pin ---------------- */
  useEffect(() => {
    // Mientras se busca la nueva, no se manda la dirección vieja.
    onAddressRef.current?.(null);
    if (!value || !clavePin) return;

    const control = new AbortController();
    const timer = window.setTimeout(async () => {
      const texto = await direccionDe(value, control.signal);
      if (control.signal.aborted) return;
      setDirInfo({ clave: clavePin, texto });
      onAddressRef.current?.(texto);
    }, 700);

    return () => {
      control.abort();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clavePin]);

  /* ---------------- Autocompletar ---------------- */
  useEffect(() => {
    const texto = query.trim();
    if (texto.length < 4) return;

    const control = new AbortController();
    const timer = window.setTimeout(async () => {
      setBuscando(true);
      try {
        setSugerencias(await buscarDirecciones(texto, control.signal));
        setError(null);
      } catch {
        if (!control.signal.aborted) setSugerencias(null);
      } finally {
        if (!control.signal.aborted) setBuscando(false);
      }
    }, 450);

    return () => {
      control.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const handleBuscar = async (event: FormEvent) => {
    event.preventDefault();
    const texto = query.trim();
    if (texto.length < 3) return;

    setBuscando(true);
    setError(null);
    try {
      setSugerencias(
        await buscarDirecciones(texto, new AbortController().signal),
      );
    } catch {
      setSugerencias(null);
      setError(
        "No pudimos buscar esa dirección. Mueve el mapa hasta tu casa o usa tu ubicación.",
      );
    } finally {
      setBuscando(false);
    }
  };

  const elegirSugerencia = (s: Sugerencia) => {
    quitarPrecision();
    irA({ lat: s.lat, lng: s.lng }, 18);
    setSugerencias(null);
    setQuery(s.titulo);
  };

  /* ---------------- GPS ---------------- */
  const mostrarPrecision = (c: Coords, metros: number) => {
    const map = mapRef.current;
    if (!map) return;
    precisionRef.current?.remove();
    precisionRef.current = L.circle([c.lat, c.lng], {
      radius: metros,
      color: "#db2777",
      weight: 1,
      fillColor: "#f472b6",
      fillOpacity: 0.12,
      interactive: false,
    }).addTo(map);
    setPrecision(Math.round(metros));
  };

  const handleUseMyLocation = () => {
    setError(null);

    if (!("geolocation" in navigator) || !window.isSecureContext) {
      setError(
        "Tu navegador no deja usar la ubicación. Mueve el mapa hasta tu casa o busca tu calle.",
      );
      return;
    }

    detenerGPS();
    setLocating(true);
    gpsActivoRef.current = true;

    let mejor: GeolocationPosition | null = null;

    const aplicar = (pos: GeolocationPosition) => {
      const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mostrarPrecision(c, pos.coords.accuracy);
      mapRef.current?.setView(
        [c.lat, c.lng],
        pos.coords.accuracy <= 60 ? 18 : 17,
        { animate: true },
      );
    };

    const terminar = () => {
      window.clearTimeout(limite);
      detenerGPS();
      if (mejor) {
        const c = { lat: mejor.coords.latitude, lng: mejor.coords.longitude };
        mapRef.current?.getContainer().setAttribute("data-activo", "1");
        irA(c, mejor.coords.accuracy <= 60 ? 18 : 17);
      }
    };

    // Respaldo: ubicación rápida de baja precisión (wifi/antenas).
    const intentarBajaPrecision = () => {
      gpsActivoRef.current = true;
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mejor = pos;
          aplicar(pos);
          terminar();
        },
        () => {
          detenerGPS();
          setError(
            redes
              ? "Desde Instagram/Facebook a veces no se puede usar la ubicación. Mueve el mapa hasta tu casa, busca tu calle, o abre la página en Chrome/Safari."
              : "No pudimos obtener tu ubicación. Mueve el mapa hasta tu casa o busca tu calle.",
          );
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
      );
    };

    // Se queda escuchando unos segundos y se queda con la lectura más precisa.
    const limite = window.setTimeout(() => {
      if (mejor) terminar();
      else {
        detenerGPS();
        intentarBajaPrecision();
      }
    }, 12000);

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (!mejor || pos.coords.accuracy < mejor.coords.accuracy) {
          mejor = pos;
          aplicar(pos);
        }
        if (pos.coords.accuracy <= 25) terminar();
      },
      (geoError) => {
        if (mejor) return terminar();
        window.clearTimeout(limite);
        detenerGPS();

        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(
            redes
              ? "Instagram/Facebook no dejó usar tu ubicación. Mueve el mapa hasta tu casa, busca tu calle, o abre la página en Chrome/Safari."
              : "No diste permiso de ubicación (puedes activarlo en el candado junto a la dirección de la página). Mientras, mueve el mapa hasta tu casa.",
          );
          return;
        }
        intentarBajaPrecision();
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <form onSubmit={handleBuscar} className="relative mb-3">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value.trim().length < 4) setSugerencias(null);
          }}
          placeholder="Busca tu calle o colonia"
          enterKeyHint="search"
          autoComplete="off"
          className="w-full rounded-2xl border border-orange-200 bg-white py-3 pl-10 pr-24 font-bold outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />
        <button
          type="submit"
          disabled={buscando || query.trim().length < 3}
          className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-black text-white disabled:bg-slate-300"
        >
          {buscando ? <Loader2 size={15} className="animate-spin" /> : "Buscar"}
        </button>

        {sugerencias && (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] z-[1000] max-h-72 overflow-y-auto rounded-2xl border border-orange-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
              <span className="text-xs font-black uppercase text-slate-400">
                {sugerencias.length ? "Elige tu dirección" : "Sin resultados"}
              </span>
              <button
                type="button"
                onClick={() => setSugerencias(null)}
                aria-label="Cerrar resultados"
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            </div>

            {sugerencias.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-500">
                No la encontramos. Busca un lugar cercano (una tienda, escuela o
                iglesia) y luego mueve el mapa hasta tu casa.
              </p>
            )}

            {sugerencias.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => elegirSugerencia(s)}
                className="block w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-pink-50"
              >
                <span className="block text-sm font-black text-slate-800">
                  {s.titulo}
                </span>
                {s.detalle && (
                  <span className="block text-xs font-semibold text-slate-500">
                    {s.detalle}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </form>

      <button
        type="button"
        onClick={locating ? detenerGPS : handleUseMyLocation}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 py-3 font-black text-white transition hover:bg-pink-700"
      >
        {locating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Afinando tu ubicación… (toca para parar)
          </>
        ) : (
          <>
            <Navigation size={18} />
            Usar mi ubicación actual
          </>
        )}
      </button>

      {redes && !error && (
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
          Si estás desde Instagram o Facebook y no jala tu ubicación, mueve el
          mapa hasta tu casa o abre la página en Chrome/Safari.
        </p>
      )}

      <div className="relative mt-3">
        <div
          ref={containerRef}
          className={`isolate z-0 w-full overflow-hidden rounded-2xl border border-orange-200 transition-[height] duration-300 ${
            grande ? "h-[62vh]" : "h-72 sm:h-80"
          }`}
        />

        {/* Pin fijo al centro: se mueve el mapa, no el pin */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-full">
          {!value && !moviendo && (
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1.5 text-xs font-black text-white shadow-lg">
              Mueve el mapa hasta tu casa
            </span>
          )}
          <svg
            width="38"
            height="48"
            viewBox="0 0 38 48"
            className={`drop-shadow-[0_6px_6px_rgba(0,0,0,.3)] transition-transform duration-200 ${
              moviendo ? "-translate-y-2.5" : ""
            }`}
            aria-hidden
          >
            <path
              d="M19 47c-1-5-17-17-17-29a17 17 0 1 1 34 0c0 12-16 24-17 29Z"
              fill="#db2777"
              stroke="#fff"
              strokeWidth="3"
            />
            <circle cx="19" cy="18" r="6.5" fill="#fff" />
          </svg>
        </div>
        <span
          className={`pointer-events-none absolute left-1/2 top-1/2 z-[499] h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 transition-all duration-200 ${
            moviendo ? "w-2 opacity-50" : "w-3.5"
          }`}
        />

        {/* Botones del mapa */}
        <div className="absolute left-2 top-2 z-[600] flex gap-1.5">
          <button
            type="button"
            onClick={() => setSatelite((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-2.5 py-2 text-xs font-black text-slate-800 shadow-md"
          >
            <Layers size={14} />
            {satelite ? "Mapa" : "Satélite"}
          </button>
          <button
            type="button"
            onClick={() => setGrande((g) => !g)}
            aria-label={grande ? "Hacer el mapa más chico" : "Agrandar el mapa"}
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/95 text-slate-800 shadow-md"
          >
            {grande ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] font-bold text-slate-400">
        🍓 el local · rosa: zona de envío gratis · línea: ruta
      </p>

      {precision !== null && precision > 60 && (
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
          Tu GPS dio una ubicación aproximada (±{precision} m). Mueve el mapa
          para dejar el pin justo en tu casa.
        </p>
      )}

      {value ? (
        <div className="mt-2 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
          <p className="flex items-center gap-1.5 text-sm font-black text-emerald-700">
            <Check size={16} /> Ubicación marcada
          </p>
          <p className="mt-0.5 text-xs font-semibold text-emerald-900/70">
            {buscandoDireccion
              ? "Buscando la dirección…"
              : direccion
                ? `Cerca de: ${direccion}`
                : "Revisa que el pin quede en tu casa."}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm font-bold text-slate-500">
          Aún no has marcado tu ubicación.
        </p>
      )}

      {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
    </div>
  );
}
