import { Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  cambiarActivoCodigo,
  crearCodigo,
  eliminarCodigo,
  listarCodigos,
} from "../../services/codigosService";
import type { AplicaSobre, CodigoDescuento } from "../../types/codigo";

const etiquetaSobre: Record<AplicaSobre, string> = {
  producto: "Solo productos (sin extras)",
  total: "Todo el pedido (con extras)",
};

export function CodigosDescuento() {
  const [codigos, setCodigos] = useState<CodigoDescuento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [codigo, setCodigo] = useState("");
  const [porcentaje, setPorcentaje] = useState("10");
  const [aplicaSobre, setAplicaSobre] = useState<AplicaSobre>("producto");
  const [guardando, setGuardando] = useState(false);

  const cargar = () =>
    listarCodigos()
      .then((lista) => {
        setCodigos(lista);
        setError(null);
      })
      .catch(() =>
        setError(
          "No se pudieron cargar los códigos. ¿Ya corriste el script codigos_descuento.sql en Supabase?",
        ),
      )
      .finally(() => setCargando(false));

  useEffect(() => {
    void cargar();
  }, []);

  const handleCrear = async (event: FormEvent) => {
    event.preventDefault();

    const limpio = codigo.trim().toUpperCase().replace(/\s+/g, "");
    const pct = Number(porcentaje);

    if (!limpio) {
      setError("Escribe el nombre del código.");
      return;
    }

    if (!Number.isInteger(pct) || pct < 1 || pct > 100) {
      setError("El porcentaje debe ser un número entero entre 1 y 100.");
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await crearCodigo({ codigo: limpio, porcentaje: pct, aplica_sobre: aplicaSobre });
      setCodigo("");
      await cargar();
    } catch {
      setError("No se pudo crear el código. Puede que ya exista uno con ese nombre.");
    } finally {
      setGuardando(false);
    }
  };

  const handleActivo = async (item: CodigoDescuento) => {
    try {
      await cambiarActivoCodigo(item.id, !item.activo);
      await cargar();
    } catch {
      setError("No se pudo actualizar el código.");
    }
  };

  const handleEliminar = async (item: CodigoDescuento) => {
    if (!window.confirm(`¿Eliminar el código ${item.codigo}?`)) return;

    try {
      await eliminarCodigo(item.id);
      await cargar();
    } catch {
      setError("No se pudo eliminar el código.");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleCrear}
        className="rounded-3xl border border-pink-100 bg-white p-5"
      >
        <h2 className="text-lg font-black">Nuevo código de descuento</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Nombre del código
            </span>
            <input
              type="text"
              value={codigo}
              onChange={(event) => setCodigo(event.target.value.toUpperCase())}
              placeholder="Ej. AMIGOS10"
              autoComplete="off"
              className="mt-1 w-full rounded-2xl border border-pink-200 p-3 font-bold uppercase outline-none focus:border-pink-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Porcentaje de descuento
            </span>
            <div className="relative mt-1">
              <input
                type="number"
                min={1}
                max={100}
                value={porcentaje}
                onChange={(event) => setPorcentaje(event.target.value)}
                className="w-full rounded-2xl border border-pink-200 p-3 pr-10 font-bold outline-none focus:border-pink-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                %
              </span>
            </div>
          </label>
        </div>

        <fieldset className="mt-4">
          <legend className="text-sm font-bold text-slate-600">
            ¿Sobre qué se aplica?
          </legend>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {(Object.keys(etiquetaSobre) as AplicaSobre[]).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setAplicaSobre(tipo)}
                className={`rounded-2xl border-2 p-3 text-left text-sm font-black transition ${
                  aplicaSobre === tipo
                    ? "border-pink-500 bg-pink-50 text-pink-700"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                {etiquetaSobre[tipo]}
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={guardando}
          className="mt-5 w-full rounded-2xl bg-pink-600 p-3 font-black text-white disabled:bg-pink-300"
        >
          {guardando ? "Guardando..." : "Crear código"}
        </button>
      </form>

      <h2 className="mt-8 text-lg font-black">Códigos creados</h2>

      {cargando && <p className="mt-3 text-slate-500">Cargando...</p>}

      {!cargando && !codigos.length && (
        <p className="mt-3 text-slate-500">Todavía no hay códigos.</p>
      )}

      <div className="mt-3 space-y-3">
        {codigos.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-2xl border bg-white p-4 ${
              item.activo ? "border-pink-100" : "border-slate-200 opacity-60"
            }`}
          >
            <div className="min-w-0">
              <p className="font-black tracking-wide">{item.codigo}</p>
              <p className="text-sm text-slate-600">
                {item.porcentaje}% · {etiquetaSobre[item.aplica_sobre]}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => handleActivo(item)}
                className={`rounded-xl px-3 py-2 text-sm font-black ${
                  item.activo
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {item.activo ? "Activo" : "Apagado"}
              </button>

              <button
                type="button"
                onClick={() => handleEliminar(item)}
                aria-label={`Eliminar ${item.codigo}`}
                className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-500"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
