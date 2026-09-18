import { useEffect, useState } from "react";
import { listarPedidosPorFecha } from "../../services/pedidosService";
import type { EstatusPedido, PedidoDB } from "../../types/pedido";

const etiquetas: Record<EstatusPedido, string> = {
  recibido: "Recibido",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
};

const hoyISO = () => new Date().toISOString().slice(0, 10);

export function HistorialPedidos() {
  const [fecha, setFecha] = useState(hoyISO());
  const [pedidos, setPedidos] = useState<PedidoDB[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    listarPedidosPorFecha(fecha)
      .then(setPedidos)
      .catch(() => setError("No se pudo cargar el historial de ese día."))
      .finally(() => setCargando(false));
  }, [fecha]);

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
        onChange={(event) => setFecha(event.target.value)}
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
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="rounded-2xl border border-pink-100 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black">
                      Pedido #{String(pedido.numero_pedido).padStart(3, "0")}
                    </p>
                    <p className="text-sm text-slate-600">
                      {pedido.nombre_cliente} ·{" "}
                      {new Date(pedido.created_at).toLocaleTimeString(
                        "es-MX",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
                      {etiquetas[pedido.estatus]}
                    </span>
                    <p className="mt-1 font-black">
                      ${Number(pedido.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {!pedidos.length && (
              <p className="text-slate-500">No hubo pedidos ese día.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
