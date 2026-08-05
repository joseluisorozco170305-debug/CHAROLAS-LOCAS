export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductGroup {
  id: string;
  title: string;
  required: boolean;
  min: number;
  max: number;
  options: ProductOption[];
}

export interface ProductSize {
  id: string;
  name: string;
  price: number;
  groupRules?: Record<
    string,
    Partial<Pick<ProductGroup, "required" | "min" | "max">>
  >;
}

export interface MenuProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  available: boolean;
  basePrice?: number;
  sizes?: ProductSize[];
  groups?: ProductGroup[];
  popular?: boolean;
  featured?: boolean;
  fixedIngredients?: string[];
}
