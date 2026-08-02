import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { buildOrderMessage, whatsappUrl } from "../utils/whatsapp";
import { formatPrice } from "../utils/formatPrice";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    items,
    subtotal,
    discount,
    total,
    removeItem,
    clearCart,
  } = useCart();

  if (!open) {
    return null;
  }

  const message = buildOrderMessage(items, subtotal, discount, total);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-pink-100 p-5">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-pink-600">
              Tu pedido
            </p>
            <h2 className="text-2xl font-black text-slate-900">
              {items.length} producto(s)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {!items.length ? (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <ShoppingBag className="mx-auto text-pink-300" size={54} />
                <p className="mt-4 font-black text-slate-900">
                  Tu pedido está vacío
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-pink-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black text-slate-900">
                      {item.quantity} x {item.productName}
                    </h3>

                    {item.sizeName && (
                      <p className="mt-1 text-sm font-semibold text-pink-600">
                        {item.sizeName}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {item.selections.map((selection) => (
                  <p
                    key={selection.groupId}
                    className="mt-2 text-sm text-slate-600"
                  >
                    <strong>{selection.groupTitle}:</strong>{" "}
                    {selection.options.map((option) => option.name).join(", ")}
                  </p>
                ))}

                {item.notes && (
                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Nota:</strong> {item.notes}
                  </p>
                )}

                <p className="mt-4 text-right text-lg font-black text-pink-600">
                  {formatPrice(item.subtotal)}
                </p>
              </article>
            ))
          )}
        </div>

        <footer className="border-t border-pink-100 p-5">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-pink-600">
                <span>Descuento miércoles</span>
                <strong>-{formatPrice(discount)}</strong>
              </div>
            )}

            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              disabled={!items.length}
              onClick={async () => {
                await navigator.clipboard.writeText(message);
                window.alert("Pedido copiado.");
              }}
              className="rounded-2xl bg-slate-100 px-5 py-3 font-black text-slate-800 disabled:opacity-40"
            >
              Copiar pedido
            </button>

            <a
              href={items.length ? whatsappUrl(message) : undefined}
              target="_blank"
              rel="noreferrer"
              className={`rounded-2xl px-5 py-4 text-center font-black text-white ${
                items.length
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "pointer-events-none bg-slate-300"
              }`}
            >
              Enviar por WhatsApp
            </a>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("¿Vaciar todo el pedido?")) {
                    clearCart();
                  }
                }}
                className="text-sm font-bold text-red-500"
              >
                Vaciar pedido
              </button>
            )}
          </div>
        </footer>
      </aside>
    </div>
  );
}
