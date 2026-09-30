import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Minus,
  Pencil,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { categorias } from "../data/categorias";
import { useMenuConPrecios } from "../hooks/useMenuConPrecios";
import { crearPedido } from "../services/pedidosService";
import type { CartItem } from "../types/cart";
import { formatPrice } from "../utils/formatPrice";
import { buildOrderMessage, whatsappUrl } from "../utils/whatsapp";
import { googleMapsLink, type Coords } from "../utils/ubicacion";
import { LocationPicker } from "./LocationPicker";
import { ProductConfigurator } from "./ProductConfigurator";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const iconForCategory = (categoryId: string) =>
  categorias.find((item) => item.id === categoryId)?.icono ?? "🍽️";

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    items,
    subtotal,
    promoDiscount,
    codigo,
    codeDiscount,
    total,
    removeCode,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const menu = useMenuConPrecios();

  const [deliveryMethod, setDeliveryMethod] = useState<
    "pickup" | "delivery" | null
  >(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentOrder, setSentOrder] = useState<{
    numero: number;
    url: string;
  } | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const isPickup = deliveryMethod === "pickup";
  const isDelivery = deliveryMethod === "delivery";
  const locationUrl = coords ? googleMapsLink(coords) : "";
  const deliveryLabel = isPickup
    ? "Pick up · Recoger en el local"
    : isDelivery
      ? "Envío a domicilio"
      : "";

  const buildFinalMessage = (orderNumber: number) =>
    [
      buildOrderMessage(
        items,
        subtotal,
        promoDiscount,
        total,
        orderNumber,
        customerName,
        codigo
          ? {
              codigo: codigo.codigo,
              porcentaje: codigo.porcentaje,
              sobre: codigo.aplica_sobre === "producto" ? "productos" : "el total",
              monto: codeDiscount,
            }
          : undefined,
      ),
      "",
      `Método de entrega: ${deliveryLabel}`,
      ...(isPickup
        ? ["El cliente recogerá su pedido en el local.", "Costo de envío: $0"]
        : [
            `📍 Ubicación: ${locationUrl}`,
            "Costo de envío pendiente de confirmación.",
          ]),
    ].join("\n");

  const handleSend = async () => {
    setSending(true);
    setSendError(null);

    // Se abre la pestaña antes de esperar al servidor para que el
    // navegador no la bloquee como ventana emergente.
    const popup = window.open("", "_blank");

    try {
      const pedido = await crearPedido({
        nombreCliente: customerName.trim(),
        items,
        zonaEntrega: deliveryLabel,
        ubicacionUrl: isPickup ? null : locationUrl,
        codigoDescuento: codigo?.codigo ?? null,
        descuentoCodigo: codigo ? codeDiscount : null,
        total,
      });

      const url = whatsappUrl(buildFinalMessage(pedido.numero_pedido));

      if (popup) {
        popup.location.href = url;
      } else {
        window.location.href = url;
      }

      setSentOrder({ numero: pedido.numero_pedido, url });
      clearCart();
    } catch {
      popup?.close();
      setSendError(
        "No se pudo registrar el pedido. Revisa tu conexión e intenta de nuevo.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    resetCheckout();
  };

  const resetCheckout = () => {
    setDeliveryMethod(null);
    setCustomerName("");
    setCoords(null);
    setSendError(null);
  };

  const handleFinish = () => {
    setConfirmOpen(false);
    setSentOrder(null);
    resetCheckout();
    onClose();
  };

  const canSend =
    items.length > 0 &&
    !!customerName.trim() &&
    !!deliveryMethod &&
    (isPickup || !!coords) &&
    !sending;

  const productoEnEdicion = editingItem
    ? menu.find((product) => product.id === editingItem.productId)
    : null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex items-center justify-between border-b border-pink-100 bg-gradient-to-r from-pink-50 to-orange-50 p-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-pink-600">
                    🛍️ Tu pedido
                  </p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {items.length} producto{items.length === 1 ? "" : "s"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-28">
                {!items.length ? (
                  <div className="grid min-h-72 place-items-center text-center">
                    <div>
                      <ShoppingBag
                        className="mx-auto text-pink-300"
                        size={54}
                      />
                      <p className="mt-4 font-black text-slate-900">
                        Tu pedido está vacío
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Ve al menú y elige tus antojos 💕
                      </p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.article
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden rounded-3xl border border-pink-100 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pink-50 text-xl">
                            {iconForCategory(item.categoryId)}
                          </span>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-black text-slate-900">
                              {item.productName}
                            </h3>

                            {item.sizeName && (
                              <p className="mt-0.5 text-sm font-bold text-pink-600">
                                {item.sizeName}
                              </p>
                            )}
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                              aria-label="Editar producto"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                              aria-label="Quitar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {item.selections.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.selections.flatMap((selection) =>
                              selection.options.map((option) => (
                                <span
                                  key={`${selection.groupId}-${option.id}`}
                                  className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700"
                                >
                                  {option.name}
                                </span>
                              )),
                            )}
                          </div>
                        )}

                        {item.notes && (
                          <p className="mt-3 rounded-xl bg-orange-50 p-2.5 text-xs font-semibold text-orange-800">
                            📝 {item.notes}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-700 shadow-sm transition active:scale-95"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="min-w-8 text-center font-black">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="grid h-9 w-9 place-items-center rounded-lg bg-white text-slate-700 shadow-sm transition active:scale-95"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <p className="text-lg font-black text-pink-600">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                )}

              </div>

              <footer className="border-t border-pink-100 bg-white p-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-pink-600">
                      <span>Promoción del día</span>
                      <strong>-{formatPrice(promoDiscount)}</strong>
                    </div>
                  )}

                  {codigo && (
                    <div className="flex items-center justify-between gap-3 text-emerald-600">
                      <span className="flex items-center gap-2">
                        Código {codigo.codigo}
                        <button
                          type="button"
                          onClick={removeCode}
                          className="text-xs font-bold text-slate-400 underline"
                        >
                          quitar
                        </button>
                      </span>
                      <strong>-{formatPrice(codeDiscount)}</strong>
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
                    onClick={() => setConfirmOpen(true)}
                    className="rounded-2xl bg-emerald-500 px-5 py-4 font-black text-white transition hover:bg-emerald-600 disabled:bg-slate-300"
                  >
                    Continuar
                  </button>

                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        window.confirm("¿Vaciar todo el pedido?") &&
                        handleClearCart()
                      }
                      className="text-sm font-bold text-red-500"
                    >
                      Vaciar pedido
                    </button>
                  )}
                </div>
              </footer>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            >
              {sentOrder ? (
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check size={30} />
                  </span>
                  <h3 className="mt-4 text-2xl font-black text-slate-900">
                    ¡Pedido #{String(sentOrder.numero).padStart(3, "0")}{" "}
                    registrado!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Solo falta que envíes el mensaje en WhatsApp para que lo
                    veamos. Si no se abrió, toca el botón.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <a
                      href={sentOrder.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-emerald-500 px-5 py-4 text-center font-black text-white"
                    >
                      Abrir WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={handleFinish}
                      className="rounded-2xl bg-slate-100 px-5 py-4 font-black text-slate-800"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase text-pink-600">
                        Confirmación
                      </p>
                      <h3 className="text-2xl font-black text-slate-900">
                        Confirma tu pedido
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfirmOpen(false)}
                      className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"
                      aria-label="Volver al carrito"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-5 rounded-3xl border border-orange-100 bg-orange-50 p-5">
                    <h4 className="font-black text-slate-900">
                      ¿A nombre de quién se entrega?
                    </h4>

                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Nombre completo"
                      className="mt-3 w-full rounded-2xl border border-orange-200 bg-white p-3 font-bold outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />

                    <h4 className="mt-5 font-black text-slate-900">
                      ¿Cómo quieres recibir tu pedido?
                    </h4>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("pickup")}
                        className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 font-black transition ${
                          isPickup
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-orange-200 bg-white text-slate-700"
                        }`}
                      >
                        <Store size={22} />
                        Pick up
                        <span className="text-xs font-bold text-slate-500">
                          Recoger en el local
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("delivery")}
                        className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 font-black transition ${
                          isDelivery
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-orange-200 bg-white text-slate-700"
                        }`}
                      >
                        <Truck size={22} />
                        Envío
                        <span className="text-xs font-bold text-slate-500">
                          Seleccionar ubicación
                        </span>
                      </button>
                    </div>

                    {isDelivery && (
                      <div className="mt-5">
                        <h4 className="font-black text-slate-900">
                          Tu ubicación
                        </h4>
                        <p className="mb-3 mt-1 text-sm text-slate-600">
                          Así no tienes que mandárnosla por WhatsApp.
                        </p>

                        <LocationPicker value={coords} onChange={setCoords} />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-pink-50 p-4">
                        <div className="flex justify-between gap-3">
                          <strong>
                            {item.quantity} x {item.productName}
                          </strong>
                          <strong className="text-pink-600">
                            {formatPrice(item.subtotal)}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-2 rounded-2xl bg-slate-950 p-5 text-white">
                    <div className="flex justify-between gap-4">
                      <span>Entrega</span>
                      <strong className="text-right">
                        {deliveryLabel || "Sin seleccionar"}
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Costo de envío</span>
                      <strong>
                        {!deliveryMethod
                          ? "—"
                          : isPickup
                            ? "Sin costo"
                            : "Se confirma por WhatsApp"}
                      </strong>
                    </div>

                    {(promoDiscount > 0 || codeDiscount > 0) && (
                      <div className="flex justify-between gap-4 text-emerald-300">
                        <span>
                          {codigo && promoDiscount === 0
                            ? `Código ${codigo.codigo}`
                            : "Descuentos"}
                        </span>
                        <strong>
                          -{formatPrice(promoDiscount + codeDiscount)}
                        </strong>
                      </div>
                    )}

                    <div className="flex justify-between text-xl">
                      <span>Total parcial</span>
                      <strong>{formatPrice(total)}</strong>
                    </div>
                  </div>

                  {sendError && (
                    <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-600">
                      {sendError}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setConfirmOpen(false)}
                      className="rounded-2xl bg-slate-100 px-5 py-4 font-black text-slate-800"
                    >
                      Seguir editando
                    </button>

                    <button
                      type="button"
                      disabled={!canSend}
                      onClick={handleSend}
                      className="rounded-2xl bg-emerald-500 px-5 py-4 text-center font-black text-white transition hover:bg-emerald-600 disabled:bg-slate-300"
                    >
                      {sending ? "Registrando..." : "Enviar por WhatsApp"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {editingItem && productoEnEdicion && (
        <ProductConfigurator
          product={productoEnEdicion}
          editingItem={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}
