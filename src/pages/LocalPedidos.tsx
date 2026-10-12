import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Lock,
  Minus,
  Pencil,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import logo from "../assets/logo-charolas-locas.png";
import { AddToCartToast } from "../components/AddToCartToast";
import { MenuSection } from "../components/MenuSection";
import { ProductConfigurator } from "../components/ProductConfigurator";
import { WednesdayBanner } from "../components/WednesdayBanner";
import { useCart } from "../context/CartContext";
import { categorias } from "../data/categorias";
import { useMenuConPrecios } from "../hooks/useMenuConPrecios";
import { crearPedido, verificarClaveLocal } from "../services/pedidosService";
import type { CartItem } from "../types/cart";
import { formatPrice } from "../utils/formatPrice";

const LLAVE_DESBLOQUEO = "charolas-locas-modo-local";
const SEGUNDOS_PANTALLA_FINAL = 12;

const leerDesbloqueo = () => {
  try {
    return localStorage.getItem(LLAVE_DESBLOQUEO) === "1";
  } catch {
    return false;
  }
};

const guardarDesbloqueo = (valor: boolean) => {
  try {
    if (valor) localStorage.setItem(LLAVE_DESBLOQUEO, "1");
    else localStorage.removeItem(LLAVE_DESBLOQUEO);
  } catch {
    /* sin almacenamiento: se pedirá la contraseña otra vez */
  }
};

const iconForCategory = (categoryId: string) =>
  categorias.find((item) => item.id === categoryId)?.icono ?? "🍽️";

/* ------------------------------------------------------------------ */
/* Candado                                                             */
/* ------------------------------------------------------------------ */

function Candado({ onUnlock }: { onUnlock: () => void }) {
  const [clave, setClave] = useState("");
  const [revisando, setRevisando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!clave) return;

    setRevisando(true);
    setError(null);

    try {
      if (await verificarClaveLocal(clave)) {
        guardarDesbloqueo(true);
        onUnlock();
      } else {
        setError("Contraseña incorrecta.");
        setClave("");
      }
    } catch {
      setError(
        "No se pudo revisar la contraseña. ¿Ya corriste supabase/local_y_eliminar.sql?",
      );
    } finally {
      setRevisando(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#fff8fb] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-pink-100 bg-white p-7 text-center shadow-xl shadow-pink-100/60"
      >
        <img
          src={logo}
          alt="Charolas Locas"
          className="mx-auto h-20 w-20 rounded-2xl object-cover"
        />
        <h1 className="mt-4 text-2xl font-black">Modo local</h1>
        <p className="mt-1 text-sm text-slate-600">
          Solo para la tablet del local.
        </p>

        <input
          type="password"
          value={clave}
          onChange={(event) => setClave(event.target.value)}
          placeholder="Contraseña"
          autoFocus
          className="mt-5 w-full rounded-2xl border border-pink-200 p-3 text-center text-lg font-bold outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />

        {error && (
          <p className="mt-3 text-sm font-bold text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={revisando || !clave}
          className="mt-4 w-full rounded-2xl bg-pink-600 p-3 font-black text-white disabled:bg-pink-300"
        >
          {revisando ? "Revisando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Carrito del local                                                   */
/* ------------------------------------------------------------------ */

interface CarritoLocalProps {
  onEditar: (item: CartItem) => void;
  onConfirmar: () => void;
  enviando: boolean;
  error: string | null;
  onCerrar?: () => void;
}

function CarritoLocal({
  onEditar,
  onConfirmar,
  enviando,
  error,
  onCerrar,
}: CarritoLocalProps) {
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

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center justify-between border-b border-pink-100 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-pink-600">
            Tu pedido
          </p>
          <h2 className="text-xl font-black">
            {items.length} producto{items.length === 1 ? "" : "s"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              type="button"
              onClick={() =>
                window.confirm("¿Vaciar todo el pedido?") && clearCart()
              }
              className="rounded-xl px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
            >
              Vaciar
            </button>
          )}
          {onCerrar && (
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar pedido"
              className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!items.length && (
          <div className="grid h-full min-h-48 place-items-center text-center">
            <div>
              <ShoppingBag className="mx-auto text-pink-300" size={46} />
              <p className="mt-3 font-black">Elige tus antojos del menú</p>
              <p className="mt-1 text-sm text-slate-500">
                Aquí aparecerá tu pedido 💕
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl border border-pink-100 p-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pink-50 text-lg">
                  {iconForCategory(item.categoryId)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-black leading-tight">{item.productName}</p>
                  {item.sizeName && (
                    <p className="text-xs font-bold text-pink-600">
                      {item.sizeName}
                    </p>
                  )}
                  {item.selections.length > 0 && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {item.selections
                        .flatMap((s) => s.options.map((o) => o.name))
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onEditar(item)}
                  aria-label="Editar producto"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Quitar producto"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Menos"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm active:scale-95"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="min-w-8 text-center font-black">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Más"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm active:scale-95"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <p className="font-black text-pink-600">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <footer className="border-t border-pink-100 p-5">
        <div className="space-y-1.5 text-sm">
          {(promoDiscount > 0 || codigo) && (
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          )}
          {promoDiscount > 0 && (
            <div className="flex justify-between text-pink-600">
              <span>Promoción del día</span>
              <strong>-{formatPrice(promoDiscount)}</strong>
            </div>
          )}
          {codigo && (
            <div className="flex justify-between text-emerald-600">
              <span>
                Código {codigo.codigo}{" "}
                <button
                  type="button"
                  onClick={removeCode}
                  className="text-xs text-slate-400 underline"
                >
                  quitar
                </button>
              </span>
              <strong>-{formatPrice(codeDiscount)}</strong>
            </div>
          )}
          <div className="flex justify-between pt-1 text-2xl font-black">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 p-2.5 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={!items.length || enviando}
          onClick={onConfirmar}
          className="mt-4 w-full rounded-2xl bg-emerald-500 px-5 py-4 text-lg font-black text-white transition hover:bg-emerald-600 disabled:bg-slate-300"
        >
          {enviando ? "Registrando..." : "Confirmar pedido"}
        </button>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function LocalPedidos() {
  const [desbloqueado, setDesbloqueado] = useState(leerDesbloqueo);
  const { items, total, clearCart } = useCart();
  const menu = useMenuConPrecios();

  const [editando, setEditando] = useState<CartItem | null>(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoListo, setPedidoListo] = useState<number | null>(null);
  const [cuenta, setCuenta] = useState(SEGUNDOS_PANTALLA_FINAL);

  const nuevoPedido = useCallback(() => {
    setPedidoListo(null);
    setError(null);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    document.title = "Modo local · Charolas Locas";
  }, []);

  // Pantalla de "pedido listo" se cierra sola para el siguiente cliente.
  useEffect(() => {
    if (pedidoListo === null) return;
    const fin = Date.now() + SEGUNDOS_PANTALLA_FINAL * 1000;
    const intervalo = window.setInterval(() => {
      const restante = Math.ceil((fin - Date.now()) / 1000);
      if (restante <= 0) nuevoPedido();
      else setCuenta(restante);
    }, 250);
    return () => window.clearInterval(intervalo);
  }, [pedidoListo, nuevoPedido]);

  if (!desbloqueado) {
    return <Candado onUnlock={() => setDesbloqueado(true)} />;
  }

  const confirmar = async () => {
    setEnviando(true);
    setError(null);

    try {
      const pedido = await crearPedido({
        nombreCliente: "Cliente en local",
        items,
        zonaEntrega: "En el local",
        ubicacionUrl: null,
        total,
      });
      clearCart();
      setCarritoAbierto(false);
      setCuenta(SEGUNDOS_PANTALLA_FINAL);
      setPedidoListo(pedido.numero_pedido);
    } catch {
      setError("No se pudo registrar. Revisa el internet e intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const salir = () => {
    if (!window.confirm("¿Salir del modo local? Se pedirá la contraseña otra vez."))
      return;
    guardarDesbloqueo(false);
    setDesbloqueado(false);
  };

  const productoEnEdicion = editando
    ? menu.find((product) => product.id === editando.productId)
    : null;

  const carritoProps = {
    onEditar: setEditando,
    onConfirmar: confirmar,
    enviando,
    error,
  };

  return (
    <div className="min-h-screen bg-[#fff8fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt=""
              className="h-11 w-11 rounded-xl object-cover"
            />
            <div>
              <p className="font-black leading-none text-pink-600">
                CHAROLAS LOCAS
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                <Store size={12} /> Pide aquí y paga en caja
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={salir}
            aria-label="Salir del modo local"
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 hover:bg-slate-100 hover:text-slate-500"
          >
            <Lock size={17} />
          </button>
        </div>
      </header>

      <WednesdayBanner />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px]">
        <main className="pb-28 lg:pb-0">
          <MenuSection compact />
        </main>

        {/* Tablet horizontal / pantalla grande: carrito siempre visible */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-l border-pink-100 lg:block">
          <CarritoLocal {...carritoProps} />
        </aside>
      </div>

      {/* Tablet vertical: barra abajo + panel */}
      {items.length > 0 && (
        <button
          type="button"
          onClick={() => setCarritoAbierto(true)}
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl bg-slate-950 px-6 py-4 text-lg font-black text-white shadow-2xl lg:hidden"
        >
          <ShoppingBag size={21} />
          Ver pedido ({items.length}) · {formatPrice(total)}
        </button>
      )}

      <AnimatePresence>
        {carritoAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm lg:hidden"
            onClick={() => setCarritoAbierto(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="h-full w-full max-w-md shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <CarritoLocal
                {...carritoProps}
                onCerrar={() => setCarritoAbierto(false)}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pedidoListo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-400 p-6 text-center text-white"
            onClick={nuevoPedido}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20">
                <Check size={36} />
              </span>
              <p className="mt-6 text-xl font-black uppercase tracking-[.2em] text-white/80">
                Tu número de pedido
              </p>
              <p className="mt-2 text-[9rem] font-black leading-none tabular-nums">
                #{String(pedidoListo).padStart(3, "0")}
              </p>
              <p className="mt-6 text-2xl font-black">Paga en caja y espera tu número 💕</p>
              <button
                type="button"
                onClick={nuevoPedido}
                className="mt-10 rounded-2xl bg-white px-8 py-4 text-lg font-black text-pink-600 shadow-xl"
              >
                Nuevo pedido ({cuenta})
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {editando && productoEnEdicion && (
        <ProductConfigurator
          product={productoEnEdicion}
          editingItem={editando}
          onClose={() => setEditando(null)}
        />
      )}

      <AddToCartToast />
    </div>
  );
}
