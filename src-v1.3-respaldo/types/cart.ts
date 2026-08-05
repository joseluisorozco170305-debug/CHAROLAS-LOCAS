export interface CartSelection {
  groupId: string;
  groupTitle: string;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  categoryId: string;
  sizeId?: string;
  sizeName?: string;
  selections: CartSelection[];
  quantity: number;
  normalUnitPrice: number;
  finalUnitPrice: number;
  subtotal: number;
  notes?: string;
}
