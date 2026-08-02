export type ProductType =
  | "fruitCream"
  | "hotcakes"
  | "waffles"
  | "saltyTray"
  | "snack"
  | "crazySnack"
  | "drink";

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  available?: boolean;
}

export interface GroupRule {
  required?: boolean;
  min?: number;
  max?: number;
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
  description?: string;

  groupRules?: Record<string, GroupRule>;
}

export interface MenuProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  type: ProductType;
  image?: string;
  available: boolean;
  popular?: boolean;
  featured?: boolean;
  tags?: string[];
  sizes?: ProductSize[];
  groups?: ProductGroup[];
  basePrice?: number;
  fixedIngredients?: string[];
  notes?: string[];
}