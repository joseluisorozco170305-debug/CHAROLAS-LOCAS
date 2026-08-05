import { isWednesday } from "../utils/schedule";

export const discountPercent = (categoryId: string) =>
  isWednesday() && categoryId === "todo-con-crema" ? 20 : 0;

export const discountedPrice = (price: number, categoryId: string) =>
  Math.round(price * (1 - discountPercent(categoryId) / 100));
