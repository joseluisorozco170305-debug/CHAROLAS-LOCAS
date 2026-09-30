import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Coords } from "../utils/ubicacion";

interface LocationPickerProps {
  value: Coords | null;
  onChange: (coords: Coords | null) => void;
}

// Centro inicial del mapa (Cuautitlán, Edo. Méx.)
const DEFAULT_CENTER: [number, number] = [19.6714, -99.1783];

const pinIcon = L.divIcon({
  className: "",
  html: '<div style="font-size:34px;line-height:34px;transform:translate(-50%,-100%);filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">📍</div>',
  iconSize: [0, 0],
});

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      zoom: value ? 17 : 14,
      zoomControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div>
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
        o toca el mapa para marcar dónde te lo llevamos (puedes arrastrar el pin)
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
