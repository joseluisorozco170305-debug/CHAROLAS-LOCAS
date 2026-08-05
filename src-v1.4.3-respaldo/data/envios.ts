export interface ShippingZone {
  id: string;
  zone: string;
  displayCost: string;
  cost: number | null;
}

export const shippingZones: ShippingZone[] = [
  { id: "nativitas", zone: "Nativitas", displayCost: "Sin costo", cost: 0 },
  { id: "san-bartolo", zone: "San Bartolo", displayCost: "Sin costo", cost: 0 },
  { id: "san-juan", zone: "San Juan", displayCost: "Sin costo", cost: 0 },
  { id: "belem", zone: "Belém", displayCost: "Sin costo", cost: 0 },
  { id: "santiaguito", zone: "Santiaguito", displayCost: "Sin costo", cost: 0 },
  { id: "barrio-los-reyes", zone: "Barrio Los Reyes", displayCost: "Sin costo", cost: 0 },
  { id: "la-concepcion", zone: "La Concepción", displayCost: "$20 – $30", cost: null },
  { id: "loma-bonita", zone: "Loma Bonita", displayCost: "$20 – $30", cost: null },
  { id: "cuayamil", zone: "Cuayamil", displayCost: "$25", cost: 25 },
  { id: "col-los-reyes", zone: "Col. Los Reyes", displayCost: "$20 – $30", cost: null },
  { id: "cartagena", zone: "Cartagena", displayCost: "$20 – $30", cost: null },
  { id: "la-bandera", zone: "La Bandera", displayCost: "$20 – $30", cost: null },
  { id: "misiones-rsb", zone: "Misiones / RSB", displayCost: "$25 – $35", cost: null },
  { id: "fuera-zona", zone: "Pasando La Bandera o Cuautitlán", displayCost: "$25 – $50", cost: null },
];
