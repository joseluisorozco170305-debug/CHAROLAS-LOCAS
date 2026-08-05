import { config } from "../data/config";
import type { CartItem } from "../types/cart";
import { formatPrice } from "./formatPrice";

export const whatsappUrl = (
  message = "Hola, quiero hacer un pedido en CHAROLAS LOCAS.",
) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

export const buildOrderMessage = (
  items: CartItem[],
  subtotal: number,
  discount: number,
  total: number,
) => {
  const lines = [
    "🍓 *CHAROLAS LOCAS*",
    "",
    "Quiero hacer este pedido:",
    "",
  ];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. *${item.quantity} x ${item.productName}*`);

    if (item.sizeName) {
      lines.push(`Tamaño: ${item.sizeName}`);
    }

    item.selections.forEach((selection) => {
      lines.push(
        `${selection.groupTitle}: ${selection.options
          .map((option) => option.name)
          .join(", ")}`,
      );
    });

    if (item.notes) {
      lines.push(`Nota: ${item.notes}`);
    }

    lines.push(`Subtotal: ${formatPrice(item.subtotal)}`, "");
  });

  lines.push(`Subtotal: ${formatPrice(subtotal)}`);

  if (discount > 0) {
    lines.push(`Descuento: -${formatPrice(discount)}`);
  }

  lines.push(`*TOTAL: ${formatPrice(total)}*`);

  return lines.join("\n");
};
