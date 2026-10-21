import { Check, Plus, Share2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { PedidoSkeleton } from "../../components/Skeletons";
import {
  agregarCompra,
  borrarCompra,
  borrarComprados,
  listarCompras,
  marcarComprado,
  suscribirseACompras,
  type ArticuloCompra,
} from "../../services/comprasService";
import { whatsappCompartirUrl } from "../../utils/whatsapp";

/**
 * Lista de lo que hace falta comprar para el local. Solo la ve el equipo
 * (está dentro del panel con sesión) y se actualiza sola en todos los
 * celulares cuando alguien agrega o tacha algo.
 */
export function ListaCompras() {
  const [articulos, setArticulos] = useState<ArticuloCompra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [guardando, setGuardando] = useState(false);

  const recargar = useCallback(
    () =>
      listarCompras()
        .then((lista) => {
          setArticulos(lista);
          setError(null);
        })
        .catch(() =>
          setError(
            "No se pudo cargar la lista. ¿Ya corriste supabase/lista_compras.sql?",
          ),
        )
        .finally(() => setCargando(false)),
    [],
  );

  useEffect(() => {
    void recargar();
    return suscribirseACompras(() => void recargar());
  }, [recargar]);

  const agregar = async (event: FormEvent) => {
    event.preventDefault();
    const nombre = producto.trim();
    if (!nombre) return;
    setGuardando(true);
    try {
      await agregarCompra(nombre, cantidad.trim());
      setProducto("");
      setCantidad("");
      await recargar();
    } catch {
      window.alert("No se pudo agregar. Revisa tu conexión.");
    } finally {
      setGuardando(false);
    }
  };

  const alternar = async (articulo: ArticuloCompra) => {
    // Se ve el cambio al instante; si falla, se recarga la lista real.
    setArticulos((lista) =>
      lista.map((a) =>
        a.id === articulo.id ? { ...a, comprado: !a.comprado } : a,
      ),
    );
    try {
      await marcarComprado(articulo.id, !articulo.comprado);
    } catch {
      void recargar();
    }
  };

  const quitar = async (articulo: ArticuloCompra) => {
    setArticulos((lista) => lista.filter((a) => a.id !== articulo.id));
    try {
      await borrarCompra(articulo.id);
    } catch {
      void recargar();
    }
  };

  const limpiarComprados = async () => {
    if (!window.confirm("¿Borrar de la lista todo lo que ya se compró?")) return;
    try {
      await borrarComprados();
      await recargar();
    } catch {
      window.alert("No se pudo limpiar la lista.");
    }
  };

  const pendientes = articulos.filter((a) => !a.comprado);
  const comprados = articulos.filter((a) => a.comprado);

  const textoWhatsApp = [
    "🛒 *Lista de compras · Charolas Locas*",
    "",
    ...pendientes.map(
      (a) => `• ${a.producto}${a.cantidad ? ` (${a.cantidad})` : ""}`,
    ),
  ].join("\n");

  return (
    <div className="space-y-4">
      <form
        onSubmit={agregar}
        className="grid gap-2 rounded-3xl border border-pink-100 bg-white p-4 sm:grid-cols-[1fr_140px_auto]"
      >
        <label className="sr-only" htmlFor="compra-producto">
          Producto
        </label>
        <input
          id="compra-producto"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          placeholder="¿Qué falta? (ej. Fresas)"
          autoComplete="off"
          className="rounded-2xl border border-pink-200 p-3 font-bold outline-none focus:border-pink-400"
        />
        <label className="sr-only" htmlFor="compra-cantidad">
          Cantidad
        </label>
        <input
          id="compra-cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cantidad (opcional)"
          autoComplete="off"
          className="rounded-2xl border border-pink-200 p-3 font-bold outline-none focus:border-pink-400"
        />
        <button
          type="submit"
          disabled={guardando || !producto.trim()}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-3 font-black text-white disabled:bg-slate-300"
        >
          <Plus size={16} aria-hidden /> Agregar
        </button>
      </form>

      {error && <p className="font-bold text-red-600">{error}</p>}

      {cargando ? (
        <div role="status" aria-label="Cargando lista" className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <PedidoSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-slate-600">
              {pendientes.length} pendiente{pendientes.length === 1 ? "" : "s"}
            </p>
            {pendientes.length > 0 && (
              <a
                href={whatsappCompartirUrl(textoWhatsApp)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700"
              >
                <Share2 size={15} aria-hidden /> Mandar por WhatsApp
              </a>
            )}
          </div>

          {!articulos.length && !error && (
            <p className="rounded-2xl border border-dashed border-pink-200 p-6 text-center text-slate-500">
              No falta nada por ahora 🎉
            </p>
          )}

          <ul className="space-y-2">
            {[...pendientes, ...comprados].map((a) => (
              <li
                key={a.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  a.comprado
                    ? "border-slate-100 bg-slate-50"
                    : "border-pink-100 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => alternar(a)}
                  aria-pressed={a.comprado}
                  aria-label={`${a.comprado ? "Desmarcar" : "Marcar como comprado"}: ${a.producto}`}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 transition ${
                    a.comprado
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-pink-200 bg-white text-transparent hover:border-pink-400"
                  }`}
                >
                  <Check size={18} aria-hidden />
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-black ${
                      a.comprado ? "text-slate-400 line-through" : ""
                    }`}
                  >
                    {a.producto}
                    {a.cantidad && (
                      <span className="ml-2 text-sm font-bold text-pink-600">
                        {a.cantidad}
                      </span>
                    )}
                  </p>
                  {a.agregado_por && (
                    <p className="truncate text-xs text-slate-400">
                      {a.agregado_por.split("@")[0]}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => quitar(a)}
                  aria-label={`Quitar ${a.producto}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500"
                >
                  <Trash2 size={15} aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          {comprados.length > 0 && (
            <button
              type="button"
              onClick={limpiarComprados}
              className="text-sm font-bold text-slate-500 underline"
            >
              Borrar los comprados ({comprados.length})
            </button>
          )}
        </>
      )}
    </div>
  );
}
