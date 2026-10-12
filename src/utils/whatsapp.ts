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
  orderNumber?: number,
  customerName?: string,
  code?: { codigo: string; porcentaje: number; sobre: string; monto: number },
  envio?: { costo: number; distancia: string },
) => {
  const lines = [
    "🍓 *CHAROLAS LOCAS*",
    "",
    ...(orderNumber
      ? [`📋 *Pedido #${String(orderNumber).padStart(3, "0")}*`, ""]
      : []),
    ...(customerName?.trim()
      ? [`👤 *Entregar a:* ${customerName.trim()}`, ""]
      : []),
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
    lines.push(`Promoción del día: -${formatPrice(discount)}`);
  }

  if (code && code.monto > 0) {
    lines.push(
      `Código ${code.codigo} (${code.porcentaje}% sobre ${code.sobre}): -${formatPrice(code.monto)}`,
    );
  }

  if (envio) {
    lines.push(
      `Envío (${envio.distancia}): ${envio.costo > 0 ? formatPrice(envio.costo) : "Gratis"}`,
    );
  }

  lines.push(`*TOTAL: ${formatPrice(total)}*`);

  return lines.join("\n");
};

/** Abre WhatsApp para elegir a quién mandar el texto (contacto o grupo). */
export const whatsappCompartirUrl = (message: string) =>
  `https://wa.me/?text=${encodeURIComponent(message)}`;
