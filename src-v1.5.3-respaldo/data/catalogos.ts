import type { ProductOption } from "../types/product";

const slug = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const zeroPrice = (values: string[]): ProductOption[] =>
  values.map((name) => ({ id: slug(name), name, price: 0 }));

export const toppings = zeroPrice([
  "Oreo",
  "Nuez",
  "Lunetas",
  "Mazapán",
  "Almendra",
  "Granillo blanco",
  "Granillo de colores",
  "Granillo de chocolate",
  "Arándano",
  "Coco rallado",
  "Mini bombones",
  "Conejito Turín",
  "Galleta María molida",
  "Chispas de chocolate",
]);

export const frutasDulces = zeroPrice([
  "Fresa",
  "Uva",
  "Blueberry",
  "Durazno",
  "Plátano",
  "Frambuesa",
  "Zarzamora",
]);

export const jarabes = zeroPrice([
  "Nutella",
  "Lechera",
  "Cajeta",
  "Hershey's",
  "Mermelada",
  "Miel Maple",
]);

export const salsas = zeroPrice([
  "Fresa Hot",
  "Original",
  "Búfalo",
  "Mango Habanero",
  "Botanera y Tajín",
  "Tamarindo",
  "Pimienta Limón",
  "BBQ",
]);

export const extrasDulces: ProductOption[] = [
  { id: "mini-kinder-bueno", name: "Mini Kinder Bueno", price: 5 },
  { id: "bubulubu", name: "Bubulubu", price: 10 },
  { id: "kitkat", name: "KitKat", price: 20 },
  { id: "kinder-delice", name: "Kinder Delice", price: 20 },
  { id: "pastelito-baileys", name: "Pastelito Baileys", price: 20 },
  { id: "helado", name: "Helado", price: 15 },
  { id: "chantilly-extra", name: "Chantilly", price: 10 },
  { id: "ingrediente-extra", name: "Ingrediente extra", price: 10 },
];

export const extrasCrema: ProductOption[] = [
  { id: "vaso-nutella", name: "Vaso con Nutella", price: 15 },
  { id: "chocolate-derretido", name: "Chocolate derretido", price: 15 },
];

export const extrasSnacks: ProductOption[] = [
  { id: "ranch-chico", name: "Ranch chico", price: 5 },
  { id: "ranch-grande", name: "Ranch grande", price: 15 },
  { id: "media-orden-papas", name: "Media orden de papas", price: 20 },
];

export const ingredientesSalados = zeroPrice([
  "Piña",
  "Sandía",
  "Melón",
  "Jícama",
  "Zanahoria",
  "Uvas",
  "Fresas",
  "Pepino",
  "Manzana",
  "Manzanas cubiertas",
  "Skwinkles",
  "Mangomita",
  "Tamborcito",
  "Pulparindo",
  "Lucas Gusano",
  "Chetos Flaming Hot",
  "Cacahuate natural",
  "Cacahuate enchilado",
  "Paleta de gomita sabor sandía",
  "Zumba Goma mango",
  "Zumba Goma sandía",
  "Zumba Goma mora",
  "Pelón",
  "Tilicos",
  "Cueritos",
  "Panditas",
  "Lombrices",
  "Picafresa",
]);

export const complementosSalados = zeroPrice([
  "Tajín",
  "Limón",
  "Chamoy",
  "Miguelito",
  "Salsa Maggy",
  "Salsa Inglesa",
  "Salsa Botanera",
]);
