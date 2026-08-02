import type {
  GroupRule,
  MenuProduct,
  ProductGroup,
  ProductOption,
  ProductSize,
} from "../types/product";

export interface ProductConfiguration {
  sizeId?: string;
  selectedOptions: Record<string, string[]>;
  quantity: number;
  notes?: string;
}

export interface ConfigurationValidation {
  valid: boolean;
  errors: string[];
}

export function getSelectedSize(
  product: MenuProduct,
  sizeId?: string,
): ProductSize | undefined {
  if (!sizeId) return undefined;

  return product.sizes?.find((size) => size.id === sizeId);
}

export function getGroupById(
  product: MenuProduct,
  groupId: string,
): ProductGroup | undefined {
  return product.groups?.find((group) => group.id === groupId);
}

export function getOptionById(
  group: ProductGroup,
  optionId: string,
): ProductOption | undefined {
  return group.options.find((option) => option.id === optionId);
}

export function getResolvedGroupRule(
  product: MenuProduct,
  group: ProductGroup,
  sizeId?: string,
): Required<GroupRule> {
  const size = getSelectedSize(product, sizeId);
  const override = size?.groupRules?.[group.id];

  return {
    required: override?.required ?? group.required,
    min: override?.min ?? group.min,
    max: override?.max ?? group.max,
  };
}

export function calculateProductUnitPrice(
  product: MenuProduct,
  configuration: ProductConfiguration,
): number {
  const selectedSize = getSelectedSize(product, configuration.sizeId);

  let total = selectedSize?.price ?? product.basePrice ?? 0;

  for (const group of product.groups ?? []) {
    const selectedIds = configuration.selectedOptions[group.id] ?? [];

    for (const optionId of selectedIds) {
      const option = getOptionById(group, optionId);

      if (option?.available !== false) {
        total += option?.price ?? 0;
      }
    }
  }

  return total;
}

export function calculateProductSubtotal(
  product: MenuProduct,
  configuration: ProductConfiguration,
): number {
  const quantity = Math.max(1, configuration.quantity);

  return calculateProductUnitPrice(product, configuration) * quantity;
}

export function validateProductConfiguration(
  product: MenuProduct,
  configuration: ProductConfiguration,
): ConfigurationValidation {
  const errors: string[] = [];

  if (!product.available) {
    errors.push("Este producto no está disponible actualmente.");
  }

  if (product.sizes?.length && !configuration.sizeId) {
    errors.push("Debes seleccionar un tamaño.");
  }

  if (
    configuration.sizeId &&
    product.sizes &&
    !product.sizes.some((size) => size.id === configuration.sizeId)
  ) {
    errors.push("El tamaño seleccionado no es válido.");
  }

  for (const group of product.groups ?? []) {
    const selectedIds = configuration.selectedOptions[group.id] ?? [];
    const rule = getResolvedGroupRule(
      product,
      group,
      configuration.sizeId,
    );

    const uniqueIds = [...new Set(selectedIds)];

    const validSelectedIds = uniqueIds.filter((optionId) => {
      const option = group.options.find((item) => item.id === optionId);

      return option && option.available !== false;
    });

    if (rule.required && validSelectedIds.length < rule.min) {
      errors.push(
        rule.min === rule.max
          ? `Debes seleccionar ${rule.min} opción(es) en "${group.title}".`
          : `Debes seleccionar al menos ${rule.min} opción(es) en "${group.title}".`,
      );
    }

    if (validSelectedIds.length > rule.max) {
      errors.push(
        `Solo puedes seleccionar ${rule.max} opción(es) en "${group.title}".`,
      );
    }

    if (validSelectedIds.length !== uniqueIds.length) {
      errors.push(`Hay opciones no válidas en "${group.title}".`);
    }
  }

  if (
    !Number.isInteger(configuration.quantity) ||
    configuration.quantity < 1
  ) {
    errors.push("La cantidad debe ser un número entero mayor que cero.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createEmptyConfiguration(
  product: MenuProduct,
): ProductConfiguration {
  const selectedOptions: Record<string, string[]> = {};

  for (const group of product.groups ?? []) {
    selectedOptions[group.id] = [];
  }

  return {
    sizeId:
      product.sizes?.length === 1
        ? product.sizes[0].id
        : undefined,
    selectedOptions,
    quantity: 1,
    notes: "",
  };
}

export function toggleOption(
  product: MenuProduct,
  group: ProductGroup,
  selectedIds: string[],
  optionId: string,
  sizeId?: string,
): string[] {
  const option = group.options.find((item) => item.id === optionId);

  if (!option || option.available === false) {
    return selectedIds;
  }

  const rule = getResolvedGroupRule(product, group, sizeId);
  const alreadySelected = selectedIds.includes(optionId);

  if (alreadySelected) {
    return selectedIds.filter((id) => id !== optionId);
  }

  if (rule.max === 1) {
    return [optionId];
  }

  if (selectedIds.length >= rule.max) {
    return selectedIds;
  }

  return [...selectedIds, optionId];
}