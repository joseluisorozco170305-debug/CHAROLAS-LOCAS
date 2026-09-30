import { ChevronDown, MapPin } from "lucide-react";
import type { CartItem } from "../../types/cart";
import type { PedidoDB } from "../../types/pedido";

export const BotonDesplegar = ({ abierto }: { abierto: boolean }) => (
  <ChevronDown
    size={18}
    className={`shrink-0 text-slate-400 transition-transform ${
      abierto ? "rotate-180" : ""
    }`}
  />
);

export function DetallePedido({ pedido }: { pedido: PedidoDB }) {
  const items = Array.isArray(pedido.items)
    ? (pedido.items as CartItem[])
    : [];

  return (
    <div className="mt-4 space-y-3 border-t border-pink-100 pt-4">
      {items.map((item, index) => (
        <div key={item.id ?? index} className="rounded-2xl bg-pink-50 p-3">
          <div className="flex justify-between gap-3">
            <strong className="text-sm">
              {item.quantity} x {item.productName}
              {item.sizeName ? ` · ${item.sizeName}` : ""}
            </strong>
            <strong className="text-sm text-pink-600">
              ${Number(item.subtotal).toFixed(2)}
            </strong>
          </div>

          {item.selections?.map((selection) => (
            <p
              key={selection.groupId}
              className="mt-1 text-xs font-semibold text-slate-600"
            >
              {selection.groupTitle}:{" "}
              {selection.options.map((option) => option.name).join(", ")}
            </p>
          ))}

          {item.notes && (
            <p className="mt-1 text-xs font-semibold text-orange-700">
              📝 {item.notes}
            </p>
          )}
        </div>
      ))}

      <div className="text-sm text-slate-700">
        <p>
          <span className="font-black">Entrega:</span>{" "}
          {pedido.zona_entrega || "—"}
        </p>

        {pedido.codigo_descuento && (
          <p className="mt-1">
            <span className="font-black">Código:</span>{" "}
            {pedido.codigo_descuento}
            {pedido.descuento_codigo
              ? ` (-$${Number(pedido.descuento_codigo).toFixed(2)})`
              : ""}
          </p>
        )}

        {pedido.ubicacion_url && (
          <a
            href={pedido.ubicacion_url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 font-black text-emerald-700"
          >
            <MapPin size={16} /> Abrir ubicación en Google Maps
          </a>
        )}
      </div>

      <p className="text-right font-black">
        Total: ${Number(pedido.total).toFixed(2)}
      </p>
    </div>
  );
}
