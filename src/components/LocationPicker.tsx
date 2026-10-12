import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, Loader2, Navigation, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LOCAL_COORDS } from "../data/envio";
import type { Coords } from "../utils/ubicacion";

interface ResultadoBusqueda {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

/** Busca direcciones con OpenStreetMap (gratis, sin API key), priorizando la zona del local. */
const buscarDireccion = async (texto: string): Promise<ResultadoBusqueda[]> => {
  const d = 0.25;
  const params = new URLSearchParams({
    q: texto,
    format: "jsonv2",
    countrycodes: "mx",
    limit: "6",
    "accept-language": "es",
    viewbox: [
      LOCAL_COORDS.lng - d,
      LOCAL_COORDS.lat + d,
      LOCAL_COORDS.lng + d,
      LOCAL_COORDS.lat - d,
    ].join(","),
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
  );
  if (!res.ok) throw new Error("busqueda");
  return (await res.json()) as ResultadoBusqueda[];
};

interface LocationPickerProps {
  value: Coords | null;
  onChange: (coords: Coords | null) => void;
  /** Ruta por calles del local al cliente, para dibujarla. */
  ruta?: [number, number][];
}

// Centro inicial del mapa: el local
const DEFAULT_CENTER: [number, number] = [LOCAL_COORDS.lat, LOCAL_COORDS.lng];

const localIcon = L.divIcon({
  className: "",
  html: '<div style="font-size:26px;line-height:26px;transform:translate(-50%,-50%);filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">🍓</div>',
  iconSize: [0, 0],
});

const pinIcon = L.divIcon({
  className: "",
  html: '<div style="font-size:34px;line-height:34px;transform:translate(-50%,-100%);filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">📍</div>',
  iconSize: [0, 0],
});

export function LocationPicker({ value, onChange, ruta }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const rutaRef = useRef<L.Polyline | null>(null);
  const onChangeRef = useRef(onChange);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<ResultadoBusqueda[] | null>(
    null,
  );

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const placeMarker = (coords: Coords) => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      return;
    }

    const marker = L.marker([coords.lat, coords.lng], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      onChangeRef.current({ lat, lng });
    });

    markerRef.current = marker;
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: value ? [value.lat, value.lng] : DEFAULT_CENTER,
      zoom: value ? 17 : 13,
      zoomControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // El local
    L.marker(DEFAULT_CENTER, { icon: localIcon, interactive: false }).addTo(
      map,
    );

    map.on("click", (event: L.LeafletMouseEvent) => {
      const coords = { lat: event.latlng.lat, lng: event.latlng.lng };
      placeMarker(coords);
      onChangeRef.current(coords);
    });

    mapRef.current = map;

    if (value) placeMarker(value);

    // El modal se anima al abrir; se recalcula el tamaño cuando termina.
    const timer = window.setTimeout(() => map.invalidateSize(), 350);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      rutaRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dibuja la ruta por calles del local al cliente.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    rutaRef.current?.remove();
    rutaRef.current = null;

    if (ruta && ruta.length > 1) {
      rutaRef.current = L.polyline(ruta, {
        color: "#db2777",
        weight: 5,
        opacity: 0.8,
        interactive: false,
      }).addTo(map);
    }
  }, [ruta]);

  // Si el valor se limpia desde afuera, se quita el pin.
  useEffect(() => {
    if (!value && markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [value]);

  const handleUseMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setError(
        "Tu navegador no permite obtener la ubicación. Toca el mapa para marcarla.",
      );
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        placeMarker(coords);
        mapRef.current?.setView([coords.lat, coords.lng], 17);
        onChange(coords);
        setLocating(false);
      },
      (geoError) => {
        setLocating(false);
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "No diste permiso de ubicación. Toca el mapa para marcar dónde estás."
            : "No pudimos obtener tu ubicación. Toca el mapa para marcarla.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleBuscar = async (event: FormEvent) => {
    event.preventDefault();
    const texto = query.trim();
    if (texto.length < 3) return;

    setBuscando(true);
    setError(null);

    try {
      setResultados(await buscarDireccion(texto));
    } catch {
      setResultados(null);
      setError("No pudimos buscar esa dirección. Intenta de nuevo o toca el mapa.");
    } finally {
      setBuscando(false);
    }
  };

  const elegirResultado = (resultado: ResultadoBusqueda) => {
    const coords = { lat: Number(resultado.lat), lng: Number(resultado.lon) };
    placeMarker(coords);
    mapRef.current?.setView([coords.lat, coords.lng], 17);
    onChange(coords);
    setResultados(null);
    setQuery(resultado.display_name.split(",").slice(0, 2).join(","));
  };

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
            setResultados(null);
          }}
          placeholder="Busca calle, colonia o un lugar cercano"
          enterKeyHint="search"
          className="w-full rounded-2xl border border-orange-200 bg-white py-3 pl-10 pr-24 font-bold outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />
        <button
          type="submit"
          disabled={buscando || query.trim().length < 3}
          className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-black text-white disabled:bg-slate-300"
        >
          {buscando ? <Loader2 size={15} className="animate-spin" /> : "Buscar"}
        </button>

        {resultados && (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] z-[1000] max-h-64 overflow-y-auto rounded-2xl border border-orange-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
              <span className="text-xs font-black uppercase text-slate-400">
                {resultados.length ? "Elige tu dirección" : "Sin resultados"}
              </span>
              <button
                type="button"
                onClick={() => setResultados(null)}
                aria-label="Cerrar resultados"
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            </div>

            {resultados.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-500">
                Prueba con otra forma de escribirlo (ej. "Calle Morelos, Cuautitlán") o toca el mapa.
              </p>
            )}

            {resultados.map((resultado) => (
              <button
                key={resultado.place_id}
                type="button"
                onClick={() => elegirResultado(resultado)}
                className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 last:border-b-0 hover:bg-pink-50"
              >
                {resultado.display_name}
              </button>
            ))}
          </div>
        )}
      </form>

      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={locating}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-600 px-4 py-3 font-black text-white transition hover:bg-pink-700 disabled:bg-pink-300"
      >
        <Navigation size={18} />
        {locating ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
      </button>

      <p className="mt-3 text-center text-xs font-bold text-slate-500">
        o toca el mapa para marcar dónde te lo llevamos (puedes arrastrar el pin).
        La 🍓 es el local; la línea rosa es el camino por calles.
      </p>

      <div
        ref={containerRef}
        className="isolate z-0 mt-2 h-64 w-full overflow-hidden rounded-2xl border border-orange-200"
      />

      {value ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-black text-emerald-700">
          <Check size={16} /> Ubicación seleccionada
        </p>
      ) : (
        <p className="mt-2 text-sm font-bold text-slate-500">
          Aún no has marcado tu ubicación.
        </p>
      )}

      {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
    </div>
  );
}
