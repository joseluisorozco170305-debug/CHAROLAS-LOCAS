import { Check, Minus, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { crearPedido } from "../../services/pedidosService";
import type { CartItem } from "../../types/cart";
import { formatPrice } from "../../utils/formatPrice";

interface Linea {
  id: string;
  titulo: string;
  precio: number;
  cantidad: number;
}

const nuevaId = () => crypto.randomUUID();

/**
 * Pedido con cosas que no están en el menú (ej. "Manzana sola · $30").
 * Se guarda igual que cualquier pedido, así que aparece en el historial
 * y suma al total del día.
 */
export function PedidoManual() {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [cliente, setCliente] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState<number | null>(null);

  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const precioNum = Number(precio);
  const puedeAgregar = titulo.trim().length > 0 && precio !== "" && precioNum >= 0;

  const agregar = (event: FormEvent) => {
    event.preventDefault();
    if (!puedeAgregar) return;
    setLineas((actual) => [
      ...actual,
      { id: nuevaId(), titulo: titulo.trim(), precio: precioNum, cantidad: 1 },
    ]);
    setTitulo("");
    setPrecio("");
    setGuardado(null);
  };

  const cambiarCantidad = (id: string, delta: number) =>
    setLineas((actual) =>
      actual.map((l) =>
        l.id === id ? { ...l, cantidad: Math.max(1, l.cantidad + delta) } : l,
      ),
    );

  const guardar = async () => {
    setGuardando(true);
    setError(null);

    const items: CartItem[] = lineas.map((l) => ({
      id: l.id,
      productId: "manual",
      productName: l.titulo,
      categoryId: "manual",
      selections: [],
      quantity: l.cantidad,
      baseUnitPrice: l.precio,
      extrasUnitPrice: 0,
      normalUnitPrice: l.precio,
      finalUnitPrice: l.precio,
      subtotal: l.precio * l.cantidad,
    }));

    try {
      const pedido = await crearPedido({
        nombreCliente: cliente.trim() || "Venta en mostrador",
        items,
        zonaEntrega: "Pedido manual",
        ubicacionUrl: null,
        total,
      });
      setGuardado(pedido.numero_pedido);
      setLineas([]);
      setCliente("");
    } catch {
      setError("No se pudo guardar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Para cosas que no están en el menú. Se guarda en el historial y suma al
        total del día.
      </p>

      <form
        onSubmit={agregar}
        className="grid gap-2 rounded-3xl border border-pink-100 bg-white p-4 sm:grid-cols-[1fr_120px_auto]"
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="¿Qué vendiste? (ej. Manzana sola)"
          className="rounded-2xl border border-pink-200 p-3 font-bold outline-none focus:border-pink-400"
        />
        <input
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.5"
          placeholder="Precio $"
          className="rounded-2xl border border-pink-200 p-3 font-bold outline-none focus:border-pink-400"
        />
        <button
          type="submit"
          disabled={!puedeAgregar}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-3 font-black text-white disabled:bg-slate-300"
        >
          <Plus size={16} /> Agregar
        </button>
      </form>

      {lineas.length > 0 && (
        <div className="space-y-2">
          {lineas.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{l.titulo}</p>
                <p className="text-xs font-bold text-slate-500">
                  {formatPrice(l.precio)} c/u
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(l.id, -1)}
                  aria-label="Menos"
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white shadow-sm"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-7 text-center font-black">{l.cantidad}</span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(l.id, 1)}
                  aria-label="Más"
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white shadow-sm"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="w-16 text-right font-black text-pink-600">
                {formatPrice(l.precio * l.cantidad)}
              </p>
              <button
                type="button"
                onClick={() => setLineas((a) => a.filter((x) => x.id !== l.id))}
                aria-label="Quitar"
                className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          <input
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nombre del cliente (opcional)"
            className="w-full rounded-2xl border border-pink-200 bg-white p-3 font-bold outline-none focus:border-pink-400"
          />

          <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 text-white">
            <span className="text-lg">Total</span>
            <strong className="text-2xl">{formatPrice(total)}</strong>
          </div>

          {error && <p className="text-sm font-bold text-red-600">{error}</p>}

          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="w-full rounded-2xl bg-emerald-500 p-4 text-lg font-black text-white disabled:bg-slate-300"
          >
            {guardando ? "Guardando..." : "Guardar pedido"}
          </button>
        </div>
      )}

      {guardado !== null && (
        <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 font-black text-emerald-700">
          <Check size={18} /> Pedido #{String(guardado).padStart(3, "0")}{" "}
          guardado en el historial.
        </p>
      )}
    </div>
  );
}
