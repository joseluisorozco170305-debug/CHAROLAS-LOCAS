import { PenLine, Store, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  eliminarPedido,
  listarPedidosPorFecha,
  suscribirseATodosLosPedidos,
} from "../../services/pedidosService";
import { fechaMexicoISO } from "../../utils/fecha";
import { BotonDesplegar, DetallePedido } from "./DetallePedido";
import type { PedidoDB } from "../../types/pedido";

const hoyISO = () => fechaMexicoISO();
const numero = (pedido: PedidoDB) =>
  String(pedido.numero_pedido).padStart(3, "0");

export function HistorialPedidos() {
  const [fecha, setFecha] = useState(hoyISO());
  const [pedidos, setPedidos] = useState<PedidoDB[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});
  const [borrando, setBorrando] = useState<string | null>(null);

  const alternar = (id: string) =>
    setAbiertos((actual) => ({ ...actual, [id]: !actual[id] }));

  const recargar = useCallback(
    () =>
      listarPedidosPorFecha(fecha)
        .then((lista) => {
          setPedidos(lista);
          setError(null);
        })
        .catch(() => setError("No se pudo cargar el historial de ese día.")),
    [fecha],
  );

  useEffect(() => {
    let vigente = true;
    listarPedidosPorFecha(fecha)
      .then((lista) => {
        if (!vigente) return;
        setPedidos(lista);
        setError(null);
      })
      .catch(() => vigente && setError("No se pudo cargar el historial de ese día."))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [fecha]);

  // Pedidos nuevos (de la página o de la tablet del local) aparecen solos.
  useEffect(() => suscribirseATodosLosPedidos(() => void recargar()), [recargar]);

  const handleEliminar = async (pedido: PedidoDB) => {
    const ok = window.confirm(
      `¿Eliminar el pedido #${numero(pedido)} de ${pedido.nombre_cliente} ($${Number(
        pedido.total,
      ).toFixed(2)})?\n\nYa no contará en el total del día. Esto no se puede deshacer.`,
    );
    if (!ok) return;

    setBorrando(pedido.id);
    try {
      await eliminarPedido(pedido.id);
      setPedidos((actual) => actual.filter((item) => item.id !== pedido.id));
    } catch (err) {
      window.alert(
        err instanceof Error && err.message === "sin-permiso"
          ? "Supabase no dejó borrarlo. Corre el script supabase/local_y_eliminar.sql en el SQL Editor."
          : "No se pudo eliminar el pedido. Revisa tu conexión e intenta de nuevo.",
      );
    } finally {
      setBorrando(null);
    }
  };

  const totalDelDia = pedidos.reduce(
    (suma, pedido) => suma + Number(pedido.total),
    0,
  );

  return (
    <div>
      <input
        type="date"
        value={fecha}
        max={hoyISO()}
        onChange={(event) => {
          setFecha(event.target.value);
          setCargando(true);
          setAbiertos({});
        }}
        className="rounded-2xl border border-pink-200 bg-white p-3 text-sm font-bold outline-none"
      />

      {cargando && <p className="mt-4 text-slate-500">Cargando...</p>}

      {error && <p className="mt-4 font-bold text-red-600">{error}</p>}

      {!cargando && !error && (
        <>
          <p className="mt-4 text-sm font-bold text-slate-600">
            {pedidos.length} pedido{pedidos.length === 1 ? "" : "s"} · Total
            del día: ${totalDelDia.toFixed(2)}
          </p>

          <div className="mt-4 space-y-3">
            {pedidos.map((pedido) => {
              const enLocal = pedido.zona_entrega === "En el local";
              const manual = pedido.zona_entrega === "Pedido manual";

              return (
                <div
                  key={pedido.id}
                  className={`rounded-2xl border border-pink-100 bg-white p-4 transition ${
                    borrando === pedido.id ? "opacity-40" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => alternar(pedido.id)}
                      aria-expanded={!!abiertos[pedido.id]}
                      className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                    >
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-black">
                          Pedido #{numero(pedido)}
                          {enLocal && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-black text-orange-700">
                              <Store size={12} /> Local
                            </span>
                          )}
                          {manual && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-black text-violet-700">
                              <PenLine size={12} /> Especial
                            </span>
                          )}
                        </p>
                        <p className="truncate text-sm text-slate-600">
                          {pedido.nombre_cliente} ·{" "}
                          {new Date(pedido.created_at).toLocaleTimeString(
                            "es-MX",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>

                      <p className="shrink-0 font-black">
                        ${Number(pedido.total).toFixed(2)}
                      </p>

                      <BotonDesplegar abierto={!!abiertos[pedido.id]} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEliminar(pedido)}
                      disabled={borrando === pedido.id}
                      aria-label={`Eliminar pedido ${numero(pedido)}`}
                      title="Eliminar pedido"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {abiertos[pedido.id] && <DetallePedido pedido={pedido} />}
                </div>
              );
            })}

            {!pedidos.length && (
              <p className="text-slate-500">No hubo pedidos ese día.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
