import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import type { CartItem } from "../types/cart";

interface CartValue {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  lastAddedName: string | null;
  clearLastAdded: () => void;
}

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "charolas-locas-cart-v5";

export function CartProvider({ children }: PropsWithChildren) {
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);

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

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal, 0),
    [items],
  );

  const discount = subtotal - total;

  const value = useMemo<CartValue>(
    () => ({
      items,
      subtotal,
      discount,
      total,
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
      clearCart: () => setItems([]),
      lastAddedName,
      clearLastAdded: () => setLastAddedName(null),
    }),
    [items, subtotal, discount, total, lastAddedName],
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
