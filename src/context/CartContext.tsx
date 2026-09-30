import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import type { CartItem } from "../types/cart";
import type { CodigoAplicado } from "../types/codigo";

interface CartValue {
  items: CartItem[];
  /** Suma a precio normal (sin descuentos). */
  subtotal: number;
  /** Descuento de la promoción del día (solo sobre productos). */
  promoDiscount: number;
  /** Código de descuento aplicado (si hay). */
  codigo: CodigoAplicado | null;
  /** Monto que descuenta el código. */
  codeDiscount: number;
  /** promoDiscount + codeDiscount. */
  discount: number;
  total: number;
  applyCode: (codigo: CodigoAplicado) => void;
  removeCode: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, item: CartItem) => void;
  clearCart: () => void;
  lastAddedName: string | null;
  clearLastAdded: () => void;
}

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "charolas-locas-cart-v6";

export function CartProvider({ children }: PropsWithChildren) {
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);
  const [codigo, setCodigo] = useState<CodigoAplicado | null>(null);

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.normalUnitPrice * item.quantity,
        0,
      ),
    [items],
  );

  // Total después de la promoción del día (antes de aplicar código).
  const itemsTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal, 0),
    [items],
  );

  const promoDiscount = subtotal - itemsTotal;

  // Parte del total que corresponde solo a productos (sin extras).
  const productsTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.finalUnitPrice - item.extrasUnitPrice) * item.quantity,
        0,
      ),
    [items],
  );

  const codeDiscount = codigo
    ? Math.round(
        ((codigo.aplica_sobre === "producto" ? productsTotal : itemsTotal) *
          codigo.porcentaje) /
          100,
      )
    : 0;

  const total = itemsTotal - codeDiscount;
  const discount = promoDiscount + codeDiscount;

  const value = useMemo<CartValue>(
    () => ({
      items,
      subtotal,
      promoDiscount,
      codigo,
      codeDiscount,
      discount,
      total,
      applyCode: setCodigo,
      removeCode: () => setCodigo(null),
      addItem: (item) => {
        setItems((current) => [...current, item]);
        setLastAddedName(item.productName);
      },
      removeItem: (id) =>
        setItems((current) => current.filter((item) => item.id !== id)),
      updateQuantity: (id, quantity) =>
        setItems((current) =>
          current.map((item) => {
            if (item.id !== id) return item;
            const safeQuantity = Math.max(1, quantity);
            return { ...item, quantity: safeQuantity, subtotal: item.finalUnitPrice * safeQuantity };
          }),
        ),
      updateItem: (id, item) =>
        setItems((current) =>
          current.map((existing) => (existing.id === id ? item : existing)),
        ),
      clearCart: () => {
        setItems([]);
        setCodigo(null);
      },
      lastAddedName,
      clearLastAdded: () => setLastAddedName(null),
    }),
    [
      items,
      subtotal,
      promoDiscount,
      codigo,
      codeDiscount,
      discount,
      total,
      lastAddedName,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
};
