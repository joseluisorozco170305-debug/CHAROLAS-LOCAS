import { useEffect, useState } from "react";
import {
  actualizarEstatusPedido,
  listarPedidosDeHoy,
  suscribirseATodosLosPedidos,
} from "../../services/pedidosService";
import type { EstatusPedido, PedidoDB } from "../../types/pedido";

const estatusOrden: EstatusPedido[] = [
  "recibido",
  "preparando",
  "listo",
  "entregado",
];

const etiquetas: Record<EstatusPedido, string> = {
  recibido: "Recibido",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
};

export function PedidosHoy() {
  const [pedidos, setPedidos] = useState<PedidoDB[]>([]);
  const [verEntregados, setVerEntregados] = useState(false);

  useEffect(() => {
    const cargar = () => {
      listarPedidosDeHoy()
        .then(setPedidos)
        .catch(() => {});
    };

    cargar();

    const cancelar = suscribirseATodosLosPedidos(cargar);

    return cancelar;
  }, []);

  const handleCambiarEstatus = async (
    pedido: PedidoDB,
    nuevoEstatus: EstatusPedido,
  ) => {
    try {
      await actualizarEstatusPedido(pedido.id, nuevoEstatus);
    } catch {
      window.alert("No se pudo actualizar el estatus. Intenta de nuevo.");
    }
  };

  const pedidosEntregados = pedidos.filter(
    (pedido) => pedido.estatus === "entregado",
  );
  const pedidosPendientes = pedidos.filter(
    (pedido) => pedido.estatus !== "entregado",
  );
  const pedidosVisibles = verEntregados ? pedidos : pedidosPendientes;

  return (
    <div>
      {pedidosEntregados.length > 0 && (
        <button
          type="button"
          onClick={() => setVerEntregados((valor) => !valor)}
          className="text-sm font-bold text-pink-600"
        >
          {verEntregados
            ? "Ocultar entregados"
            : `Ver entregados (${pedidosEntregados.length})`}
        </button>
      )}

      <div className="mt-4 space-y-4">
        {!pedidosVisibles.length && (
          <p className="text-slate-500">
            {pedidos.length
              ? "No hay pedidos pendientes, todos ya se entregaron."
              : "Todavía no hay pedidos hoy."}
          </p>
        )}

        {pedidosVisibles.map((pedido) => (
          <div
            key={pedido.id}
            className="rounded-3xl border border-pink-100 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black">
                  Pedido #{String(pedido.numero_pedido).padStart(3, "0")}
                </p>
                <p className="text-sm text-slate-600">
                  {pedido.nombre_cliente}
                </p>
              </div>

              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
                {etiquetas[pedido.estatus]}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {estatusOrden.map((estatus) => (
                <button
                  key={estatus}
                  type="button"
                  onClick={() => handleCambiarEstatus(pedido, estatus)}
                  disabled={pedido.estatus === estatus}
                  className={`rounded-xl px-3 py-2 text-sm font-bold ${
                    pedido.estatus === estatus
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {etiquetas[estatus]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
