import { CheckCircle2, ChefHat, Home, PackageCheck, Search, Truck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { buscarPedidoDeHoy, suscribirseAPedido } from "../services/pedidosService";
import type { EstatusPedido as EstatusPedidoType, PedidoDB } from "../types/pedido";

const pasos: {
  key: EstatusPedidoType;
  label: string;
  icon: typeof ChefHat;
}[] = [
  { key: "recibido", label: "Recibido", icon: PackageCheck },
  { key: "preparando", label: "Preparando", icon: ChefHat },
  { key: "listo", label: "Listo", icon: CheckCircle2 },
  { key: "entregado", label: "Entregado", icon: Truck },
];

export function EstatusPedido() {
  const [numero, setNumero] = useState("");
  const [pedido, setPedido] = useState<PedidoDB | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pedido) {
      return;
    }

    const cancelar = suscribirseAPedido(pedido.id, (actualizado) => {
      setPedido(actualizado);
    });

    return cancelar;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido?.id]);

  const handleBuscar = async (event: FormEvent) => {
    event.preventDefault();
    const num = Number(numero);

    if (!num || num <= 0) {
      setError("Escribe un número de pedido válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setPedido(null);

    try {
      const encontrado = await buscarPedidoDeHoy(num);

      if (!encontrado) {
        setError(
          "No encontramos ese número de pedido para el día de hoy.",
        );
      } else {
        setPedido(encontrado);
      }
    } catch {
      setError("Ocurrió un error al buscar tu pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const pasoActualIndex = pedido
    ? pasos.findIndex((paso) => paso.key === pedido.estatus)
    : -1;

  return (
    <div className="min-h-screen bg-[#fff8fb] px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-lg">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-pink-600"
        >
          <Home size={16} />
          Volver al inicio
        </Link>

        <h1 className="mt-4 text-3xl font-black">Estatus de tu pedido</h1>
        <p className="mt-1 text-slate-600">
          Escribe el número de pedido que recibiste al enviar tu orden por
          WhatsApp.
        </p>

        <form onSubmit={handleBuscar} className="mt-6 flex gap-3">
          <input
            type="number"
            inputMode="numeric"
            value={numero}
            onChange={(event) => setNumero(event.target.value)}
            placeholder="Ej. 3"
            className="w-full rounded-2xl border border-pink-200 bg-white p-4 font-bold outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="grid place-items-center rounded-2xl bg-pink-600 px-5 font-black text-white disabled:bg-slate-300"
          >
            <Search size={20} />
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        {pedido && (
          <div className="mt-8 rounded-3xl border border-pink-100 bg-white p-6">
            <p className="text-sm font-black uppercase text-pink-600">
              Pedido #{String(pedido.numero_pedido).padStart(3, "0")}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              A nombre de {pedido.nombre_cliente}
            </p>

            <div className="mt-6 space-y-4">
              {pasos.map((paso, index) => {
                const Icon = paso.icon;
                const activo = index <= pasoActualIndex;

                return (
                  <div key={paso.key} className="flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-full ${
                        activo
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <span
                      className={`font-bold ${
                        activo ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {paso.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Esta pantalla se actualiza sola cuando cambia el estatus.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
