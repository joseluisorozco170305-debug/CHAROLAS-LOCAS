export interface ShippingZone {
  zone: string;
  cost: string;
}

export const shippingZones: ShippingZone[] = [
  { zone: "Nativitas", cost: "Sin costo" },
  { zone: "San Bartolo", cost: "Sin costo" },
  { zone: "San Juan", cost: "Sin costo" },
  { zone: "Belém", cost: "Sin costo" },
  { zone: "Santiaguito", cost: "Sin costo" },
  { zone: "Barrio Los Reyes", cost: "Sin costo" },
  { zone: "La Concepción", cost: "$20 – $30" },
  { zone: "Loma Bonita", cost: "$20 – $30" },
  { zone: "Cuayamil", cost: "$25" },
  { zone: "Col. Los Reyes", cost: "$20 – $30" },
  { zone: "Cartagena", cost: "$20 – $30" },
  { zone: "La Bandera", cost: "$20 – $30" },
  { zone: "Misiones / RSB", cost: "$25 – $35" },
  { zone: "Pasando La Bandera o Cuautitlán", cost: "$25 – $50" },
];
