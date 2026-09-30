import { isWednesday } from "../utils/schedule";

/** Promo de los miércoles: 20% en la categoría "Todo con crema". */
export const discountPercent = (categoryId: string) =>
  isWednesday() && categoryId === "todo-con-crema" ? 20 : 0;

/**
 * Aplica la promoción SOLO al precio del producto (tamaño o precio base).
 * Los extras nunca se pasan por aquí: se cobran a precio normal.
 */
export const discountedPrice = (price: number, categoryId: string) =>
  Math.round(price * (1 - discountPercent(categoryId) / 100));
