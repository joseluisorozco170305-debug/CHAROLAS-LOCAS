import type { MenuProduct, ProductGroup } from "../types/product";
import type { CartItem } from "../types/cart";

export interface ProductConfiguration {
  sizeId?: string;
  selectedOptions: Record<string, string[]>;
  quantity: number;
  notes: string;
}

export const createEmptyConfiguration = (
  product: MenuProduct,
): ProductConfiguration => ({
  sizeId: product.sizes?.length === 1 ? product.sizes[0].id : undefined,
  selectedOptions: Object.fromEntries(
    (product.groups ?? []).map((group) => [group.id, []]),
  ),
  quantity: 1,
  notes: "",
});

export const createConfigurationFromCartItem = (
  product: MenuProduct,
  item: CartItem,
): ProductConfiguration => ({
  sizeId: item.sizeId,
  selectedOptions: Object.fromEntries(
    (product.groups ?? []).map((group) => [
      group.id,
      item.selections.find((selection) => selection.groupId === group.id)
        ?.options.map((option) => option.id) ?? [],
    ]),
  ),
  quantity: item.quantity,
  notes: item.notes ?? "",
});

export const getResolvedRule = (
  product: MenuProduct,
  group: ProductGroup,
  sizeId?: string,
) => {
  const size = product.sizes?.find((item) => item.id === sizeId);
  const override = size?.groupRules?.[group.id];

  return {
    required: override?.required ?? group.required,
    min: override?.min ?? group.min,
    max: override?.max ?? group.max,
  };
};

export const toggleOption = (
  product: MenuProduct,
  group: ProductGroup,
  current: string[],
  optionId: string,
  sizeId?: string,
) => {
  const rule = getResolvedRule(product, group, sizeId);

  if (current.includes(optionId)) {
    return current.filter((id) => id !== optionId);
  }

  if (rule.max === 1) {
    return [optionId];
  }

  if (current.length >= rule.max) {
    return current;
  }

  return [...current, optionId];
};

/**
 * Separa el precio en dos partes:
 * - base: el producto (tamaño o precio base). Es lo único que recibe descuentos.
 * - extras: opciones con costo (extras, complementos). Se cobran siempre completos.
 */
export const calculatePriceParts = (
  product: MenuProduct,
  config: ProductConfiguration,
) => {
  const selectedSize = product.sizes?.find(
    (size) => size.id === config.sizeId,
  );

  const base = selectedSize?.price ?? product.basePrice ?? 0;

  let extras = 0;

  for (const group of product.groups ?? []) {
    for (const id of config.selectedOptions[group.id] ?? []) {
      extras += group.options.find((option) => option.id === id)?.price ?? 0;
    }
  }

  return { base, extras };
};

export const validateConfiguration = (
  product: MenuProduct,
  config: ProductConfiguration,
) => {
  const errors: string[] = [];

  if (product.sizes?.length && !config.sizeId) {
    errors.push("Selecciona un tamaño.");
  }

  for (const group of product.groups ?? []) {
    const selected = config.selectedOptions[group.id] ?? [];
    const rule = getResolvedRule(product, group, config.sizeId);

    if (rule.required && selected.length < rule.min) {
      errors.push(`Selecciona ${rule.min} opción(es) en ${group.title}.`);
    }

    if (selected.length > rule.max) {
      errors.push(`Solo puedes elegir ${rule.max} opción(es) en ${group.title}.`);
    }
  }

  return errors;
};
