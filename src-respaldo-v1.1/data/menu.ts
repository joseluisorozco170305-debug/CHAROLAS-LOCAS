import type { MenuProduct, ProductOption } from "../types/product";
import {
  complementosSalados,
  extrasCrema,
  extrasDulces,
  extrasSnacks,
  frutasDulces,
  ingredientesSalados,
  jarabes,
  salsas,
  toppings,
} from "./catalogos";

const option = (id: string, name: string, price = 0): ProductOption => ({
  id,
  name,
  price,
});

const group = (
  id: string,
  title: string,
  options: ProductOption[],
  min = 0,
  max = options.length,
  required = min > 0,
) => ({ id, title, options, min, max, required });

const simple = (
  id: string,
  categoryId: string,
  name: string,
  description: string,
  basePrice: number,
  extra: Partial<MenuProduct> = {},
): MenuProduct => ({
  id,
  categoryId,
  name,
  description,
  basePrice,
  available: true,
  ...extra,
});

const creamSizes = [
  {
    id: "mini",
    name: "Mini (1/4)",
    price: 60,
    groupRules: { toppings: { required: true, min: 1, max: 1 } },
  },
  {
    id: "chico",
    name: "Chico (1/2 litro)",
    price: 100,
    groupRules: { toppings: { required: true, min: 2, max: 2 } },
  },
  {
    id: "grande",
    name: "Grande (1 litro)",
    price: 195,
    groupRules: { toppings: { required: false, min: 0, max: 5 } },
  },
];

const creamGroups = [
  group("toppings", "Elige tus toppings", toppings, 1, 1, true),
  group("extras", "Extras opcionales", extrasCrema, 0, extrasCrema.length, false),
];

const sweetGroups = [
  group("frutas", "Elige tus frutas", frutasDulces, 1, 1, true),
  group("toppings", "Elige tus toppings", toppings, 1, 1, true),
  group("jarabes", "Elige tus jarabes", jarabes, 1, 1, true),
  group("extras", "Extras opcionales", extrasDulces, 0, extrasDulces.length, false),
];

const drinks = [
  ["frappe-vainilla", "Frappé de vainilla", 65],
  ["frappe-chocolate", "Frappé de chocolate", 65],
  ["frappe-chocoretas", "Frappé de Chocoretas", 65],
  ["frappe-oreo", "Frappé de Oreo", 75],
  ["frappe-capuchino", "Frappé de capuchino", 75],
  ["frappe-mazapan", "Frappé de mazapán", 75],
  ["frappe-mamut", "Frappé de Mamut", 75],
  ["frappe-nutella", "Frappé de Nutella", 80],
  ["frappe-carlos-v", "Frappé Carlos V", 80],
  ["frappe-baileys", "Frappé Baileys", 85],
  ["frappe-kinder-delice", "Frappé Kinder Delice", 85],
  ["malteada-fresa", "Malteada de fresa", 50],
  ["malteada-vainilla", "Malteada de vainilla", 50],
  ["malteada-platano", "Malteada de plátano", 50],
  ["malteada-chocolate", "Malteada de chocolate", 50],
  ["malteada-oreo", "Malteada de Oreo", 55],
  ["licuado-fresa", "Licuado de fresa", 40],
  ["licuado-vainilla", "Licuado de vainilla", 40],
  ["licuado-platano", "Licuado de plátano", 40],
  ["licuado-chocolate", "Licuado de chocolate", 40],
  ["licuado-nuez", "Licuado de nuez", 45],
  ["sidral", "Sidral", 25],
  ["squirt", "Squirt", 25],
  ["sangria", "Sangría", 25],
  ["penafiel", "Peñafiel", 25],
  ["coca-cola", "Coca-Cola", 25],
  ["manzanita", "Manzanita", 25],
  ["mirinda", "Mirinda", 20],
  ["refresco-preparado", "Refresco preparado", 45],

  // Especiales faltantes
  ["azulitos", "Azulitos", 80],
  ["mangonada", "Mangonada", 90],
  ["ice-cereza", "Ice cereza", 90],
  ["ice-mora-azul", "Ice mora azul", 90],
  ["picafresa-con-mango", "Picafresa con mango", 90],
  ["frappe-fresas-con-crema", "Frappé de fresas con crema", 90],

  // Mojitos sin alcohol
  ["mojito-coco", "Mojito de coco sin alcohol", 75],
  ["mojito-fresa", "Mojito de fresa sin alcohol", 70],
  ["mojito-mango", "Mojito de mango sin alcohol", 70],
  ["mojito-frutos-rojos", "Mojito de frutos rojos sin alcohol", 75],
  ["mojito-menta-tradicional", "Mojito de menta tradicional sin alcohol", 70],
] as const;

export const menu: MenuProduct[] = [
  ...[
    ["fresas-con-crema", "Fresas con crema"],
    ["duraznos-con-crema", "Duraznos con crema"],
    ["platanos-con-crema", "Plátanos con crema"],
  ].map(([id, name]) => ({
    id,
    categoryId: "todo-con-crema",
    name,
    description: "Fruta con crema, chantilly y toppings.",
    available: true,
    sizes: creamSizes,
    groups: creamGroups,
    popular: id === "fresas-con-crema",
    featured: id === "fresas-con-crema",
  })),

  {
    id: "uvas-con-crema",
    categoryId: "todo-con-crema",
    name: "Uvas con crema",
    description: "Uvas con crema, chantilly y toppings.",
    available: true,
    popular: true,
    sizes: [
      {
        id: "mini",
        name: "Mini (1/4)",
        price: 70,
        groupRules: { toppings: { required: true, min: 1, max: 1 } },
      },
      {
        id: "chico",
        name: "Chico (1/2 litro)",
        price: 110,
        groupRules: { toppings: { required: true, min: 2, max: 2 } },
      },
      {
        id: "grande",
        name: "Grande (1 litro)",
        price: 215,
        groupRules: { toppings: { required: false, min: 0, max: 5 } },
      },
    ],
    groups: creamGroups,
  },

  simple(
    "frutas-combinadas",
    "todo-con-crema",
    "Frutas combinadas con crema",
    "Combinación de frutas, crema, chantilly y toppings.",
    65,
    {
      sizes: [
        {
          id: "mini",
          name: "Mini (1/4)",
          price: 65,
          groupRules: {
            frutas: { required: true, min: 2, max: 4 },
            toppings: { required: true, min: 1, max: 1 },
          },
        },
        {
          id: "chico",
          name: "Chico (1/2 litro)",
          price: 105,
          groupRules: {
            frutas: { required: true, min: 2, max: 4 },
            toppings: { required: true, min: 2, max: 2 },
          },
        },
        {
          id: "grande",
          name: "Grande (1 litro)",
          price: 215,
          groupRules: {
            frutas: { required: true, min: 2, max: 4 },
            toppings: { required: false, min: 0, max: 5 },
          },
        },
      ],
      groups: [
        group("frutas", "Elige las frutas", frutasDulces, 2, 4, true),
        creamGroups[0],
        creamGroups[1],
      ],
    },
  ),

  simple(
    "brocheta-dulce",
    "todo-con-crema",
    "Brocheta dulce",
    "Cobertura de chocolate y un topping.",
    45,
    {
      groups: [
        group(
          "variedad",
          "Elige la variedad",
          [
            option("uva", "Uva"),
            option("fresa", "Fresa"),
            option("bombones", "Bombones"),
            option("mini-hotcakes", "Mini Hotcakes"),
            option("combinada", "Combinada"),
          ],
          1,
          1,
          true,
        ),
        group("toppings", "Elige 1 topping", toppings, 1, 1, true),
      ],
    },
  ),

  simple(
    "concha-rellena",
    "todo-con-crema",
    "Concha rellena",
    "Concha con fruta, crema, topping y chantilly.",
    45,
    {
      groups: [
        group(
          "sabor",
          "Elige el sabor",
          [option("chocolate", "Chocolate"), option("vainilla", "Vainilla")],
          1,
          1,
          true,
        ),
        group(
          "relleno",
          "Elige el relleno",
          [
            option("fresas", "Fresas con crema"),
            option("duraznos", "Duraznos con crema"),
          ],
          1,
          1,
          true,
        ),
        group("toppings", "Elige 1 topping", toppings, 1, 1, true),
      ],
    },
  ),

  {
    id: "mini-hotcakes",
    categoryId: "dulces",
    name: "Mini Hotcakes",
    description: "Personaliza frutas, toppings y jarabes.",
    available: true,
    popular: true,
    featured: true,
    sizes: [
      {
        id: "chica",
        name: "Chica · 15 piezas",
        price: 65,
        groupRules: {
          frutas: { min: 1, max: 1 },
          toppings: { min: 1, max: 1 },
          jarabes: { min: 1, max: 1 },
        },
      },
      {
        id: "mediana",
        name: "Mediana · 18 piezas",
        price: 75,
        groupRules: {
          frutas: { min: 2, max: 2 },
          toppings: { min: 2, max: 2 },
          jarabes: { min: 2, max: 2 },
        },
      },
      {
        id: "grande",
        name: "Grande · 22 piezas",
        price: 90,
        groupRules: {
          frutas: { min: 3, max: 3 },
          toppings: { min: 3, max: 3 },
          jarabes: { min: 3, max: 3 },
        },
      },
      {
        id: "extra-grande",
        name: "Extra Grande · 33 piezas",
        price: 135,
        groupRules: {
          frutas: { required: false, min: 0, max: 5 },
          toppings: { required: false, min: 0, max: 5 },
          jarabes: { required: false, min: 0, max: 5 },
        },
      },
    ],
    groups: sweetGroups,
  },

  {
    id: "mini-waffles",
    categoryId: "dulces",
    name: "Mini Waffles",
    description: "Personaliza frutas, toppings y jarabes.",
    available: true,
    popular: true,
    sizes: [
      {
        id: "chica",
        name: "Chica · 15 piezas",
        price: 70,
        groupRules: {
          frutas: { min: 1, max: 1 },
          toppings: { min: 1, max: 1 },
          jarabes: { min: 1, max: 1 },
        },
      },
      {
        id: "mediana",
        name: "Mediana · 20 piezas",
        price: 85,
        groupRules: {
          frutas: { min: 2, max: 2 },
          toppings: { min: 2, max: 2 },
          jarabes: { min: 2, max: 2 },
        },
      },
      {
        id: "grande",
        name: "Grande · 25 piezas",
        price: 100,
        groupRules: {
          frutas: { min: 3, max: 3 },
          toppings: { min: 3, max: 3 },
          jarabes: { min: 3, max: 3 },
        },
      },
      {
        id: "extra-grande",
        name: "Extra Grande · 30 piezas",
        price: 130,
        groupRules: {
          frutas: { required: false, min: 0, max: 5 },
          toppings: { required: false, min: 0, max: 5 },
          jarabes: { required: false, min: 0, max: 5 },
        },
      },
    ],
    groups: sweetGroups,
  },

  simple(
    "waffle-tradicional",
    "dulces",
    "Waffle tradicional",
    "Con 2 frutas, 1 topping y 1 jarabe.",
    90,
    {
      groups: [
        group("frutas", "Elige 2 frutas", frutasDulces, 2, 2, true),
        group("toppings", "Elige 1 topping", toppings, 1, 1, true),
        group("jarabes", "Elige 1 jarabe", jarabes, 1, 1, true),
        group("extras", "Extras opcionales", extrasDulces, 0, extrasDulces.length, false),
      ],
    },
  ),

  simple(
    "charola-salada",
    "frutas-saladas",
    "¡Ármala a tu gusto!",
    "Escoge exactamente 7 ingredientes y agrega tus complementos.",
    90,
    {
      featured: true,
      groups: [
        group(
          "ingredientes",
          "Elige exactamente 7 ingredientes",
          ingredientesSalados,
          7,
          7,
          true,
        ),
        group(
          "complementos",
          "Elige tus complementos",
          complementosSalados,
          0,
          complementosSalados.length,
          false,
        ),
      ],
    },
  ),

  simple("pale-sandia", "frutas-saladas", "Pale Sandía", "Sandía con chamoy, Miguelito o Tajín y gomitas.", 45),
  simple("pale-mango", "frutas-saladas", "Pale Mango", "Mango con chamoy y 3 ingredientes.", 65),
  simple("brocheta-uvas", "frutas-saladas", "Brocheta de uvas", "Uvas cubiertas de tamarindo picosito.", 45),
  simple("brocheta-frutas", "frutas-saladas", "Brocheta de frutas", "Sandía, piña y melón con chamoy, Miguelito y Tajín.", 25),

  ...[
    ["alitas", "Alitas", 85, true],
    ["nachos", "Nachos", 45, false],
    ["tenders", "Tenders", 95, true],
    ["nuggets", "Nuggets", 80, false],
    ["boneless", "Boneless", 95, true],
    ["salchipapas", "Salchipapas", 70, false],
    ["aros-cebolla", "Aros de cebolla", 50, false],
    ["papas-gajo", "Papas Gajo", 65, false],
    ["salchipulpos", "Salchipulpos", 50, false],
    ["dedos-queso", "Dedos de queso", 85, false],
    ["palomitas-pollo", "Palomitas de pollo", 80, false],
    ["papas-francesa", "Papas a la francesa", 55, false],
    ["hamburguesa-tenders", "Hamburguesa de Tenders", 120, true],
    ["hamburguesa-boneless", "Hamburguesa de Boneless", 125, true],
  ].map(([id, name, price, needsSauce]) =>
    simple(String(id), "snacks-calientes", String(name), "Preparado al momento.", Number(price), {
      popular: id === "boneless",
      groups: [
        ...(needsSauce
          ? [group("salsa", "Elige una salsa", salsas, 1, 1, true)]
          : []),
        group("extras", "Extras opcionales", extrasSnacks, 0, extrasSnacks.length, false),
      ],
    }),
  ),

  simple(
    "combo-individual",
    "snacks-calientes",
    "Combo Individual",
    "3 alitas, 5 boneless, papas y aros.",
    140,
    {
      groups: [
        group("sabor-alitas", "Elige el sabor de las alitas", salsas, 1, 1, true),
        group("sabor-boneless", "Elige el sabor de los boneless", salsas, 1, 1, true),
        group("extras", "Extras opcionales", extrasSnacks, 0, extrasSnacks.length, false),
      ],
    },
  ),

  simple(
    "combo-familiar",
    "snacks-calientes",
    "Combo Familiar",
    "Alitas, boneless y papas.",
    225,
    {
      groups: [
        group("sabor-alitas", "Elige el sabor de las alitas", salsas, 1, 1, true),
        group("sabor-boneless", "Elige el sabor de los boneless", salsas, 1, 1, true),
        group("extras", "Extras opcionales", extrasSnacks, 0, extrasSnacks.length, false),
      ],
    },
  ),

  simple(
    "combo-parejas",
    "snacks-calientes",
    "Combo Parejas",
    "Alitas, boneless, mini hotcakes, fruta con crema y charola salada.",
    285,
    {
      groups: [
        group(
          "sabor-alitas",
          "Elige el sabor de las alitas",
          salsas,
          1,
          1,
          true,
        ),
        group(
          "sabor-boneless",
          "Elige el sabor de los boneless",
          salsas,
          1,
          1,
          true,
        ),
        group(
          "hotcakes-fruta",
          "Elige 1 fruta para los mini hotcakes",
          frutasDulces,
          1,
          1,
          true,
        ),
        group(
          "hotcakes-topping",
          "Elige 1 topping para los mini hotcakes",
          toppings,
          1,
          1,
          true,
        ),
        group(
          "hotcakes-jarabe",
          "Elige 1 jarabe para los mini hotcakes",
          jarabes,
          1,
          1,
          true,
        ),
        group(
          "charola-ingredientes",
          "Elige exactamente 7 ingredientes para la charola salada",
          ingredientesSalados,
          7,
          7,
          true,
        ),
        group(
          "charola-complementos",
          "Elige los complementos de la charola salada",
          complementosSalados,
          0,
          complementosSalados.length,
          false,
        ),
        group(
          "extras",
          "Extras opcionales",
          extrasSnacks,
          0,
          extrasSnacks.length,
          false,
        ),
      ],
    },
  ),

  simple(
    "combo-kids",
    "snacks-calientes",
    "Combo Kids",
    "Nuggets o palomitas, papas y brocheta.",
    165,
    {
      groups: [
        group(
          "principal",
          "Elige Nuggets o Palomitas de pollo",
          [
            option("nuggets", "Nuggets"),
            option("palomitas-pollo", "Palomitas de pollo"),
          ],
          1,
          1,
          true,
        ),
      ],
    },
  ),

  simple(
    "combo-amigos",
    "snacks-calientes",
    "Combo Amigos",
    "Alitas, nachos, papas gajo y papas locas.",
    235,
    {
      groups: [
        group("sabor-alitas", "Elige el sabor de las alitas", salsas, 1, 1, true),
        group("extras", "Extras opcionales", extrasSnacks, 0, extrasSnacks.length, false),
      ],
    },
  ),

  ...[
    ["dorilocos", "Dorilocos", 45],
    ["gomiboing", "Gomiboing", 45],
    ["chicharroncitos", "Chicharroncitos preparados", 50],
    ["vaso-loco", "Vaso Loco", 55],
    ["manzana-loca", "Manzana Loca", 60],
    ["pepinos-locos", "Pepinos Locos", 75],
    ["hotcakes-cremosos", "Hotcakes Cremosos", 95],
    ["fresada", "Fresada", 40],
    ["arizona-loca", "Arizona Loca", 45],
    ["charola-cubierta", "Charola Cubierta", 75],
    ["charolon", "Charolón", 240],
    ["charola-suprema", "Charola Suprema", 250],
  ].map(([id, name, price]) =>
    simple(String(id), "charolas-locas", String(name), "Una combinación completamente loca.", Number(price), {
      popular: id === "charolon",
      featured: id === "charola-suprema",
    }),
  ),

  {
    id: "marucharola",
    categoryId: "charolas-locas",
    name: "Marucharola",
    description: "Maruchan, Chetos, papas Flaming Hot, Takis, queso, limón y salsa.",
    available: true,
    sizes: [
      { id: "medio-litro", name: "1/2 litro", price: 80 },
      { id: "litro", name: "1 litro", price: 155 },
    ],
  },
  {
    id: "maruesquites",
    categoryId: "charolas-locas",
    name: "Maruesquites",
    description: "Maruchan, esquites, papas, quesos, mayonesa, limón y salsa.",
    available: true,
    sizes: [
      { id: "medio-litro", name: "1/2 litro", price: 95 },
      { id: "litro", name: "1 litro", price: 185 },
    ],
  },
  {
    id: "papas-locas",
    categoryId: "charolas-locas",
    name: "Papas Locas",
    description: "Papas naturales, pepino, cueritos, cacahuates y salsas.",
    available: true,
    sizes: [
      { id: "medio-litro", name: "1/2 litro", price: 65 },
      { id: "litro", name: "1 litro", price: 120 },
    ],
  },

  {
    id: "aguas-frescas",
    categoryId: "bebidas",
    name: "Aguas frescas",
    description: "Fresa, melón, limón, mango, sandía o pepino.",
    available: true,
    featured: true,
    sizes: [
      { id: "litro", name: "1 litro", price: 30 },
      { id: "litro-medio", name: "1 ½ litros", price: 40 },
    ],
    groups: [
      group(
        "sabores",
        "Elige sabor",
        ["Fresa", "Melón", "Limón", "Mango", "Sandía", "Pepino"].map((name) =>
          option(name.toLowerCase(), name),
        ),
        1,
        2,
        true,
      ),
      group(
        "extras",
        "Opción combinada",
        [option("combinada", "Agua combinada", 10)],
        0,
        1,
        false,
      ),
    ],
  },

  ...drinks.map(([id, name, price]) =>
    simple(
      id,
      "bebidas",
      name,
      id.startsWith("mojito-")
        ? "Mojito refrescante preparado sin alcohol."
        : id.startsWith("frappe-")
          ? "Frappé cremoso preparado al momento."
          : id.startsWith("malteada-")
            ? "Malteada cremosa preparada al momento."
            : id.startsWith("licuado-")
              ? "Licuado preparado al momento."
              : ["azulitos", "mangonada", "ice-cereza", "ice-mora-azul", "picafresa-con-mango"].includes(id)
                ? "Bebida especial preparada al momento."
                : "Drink preparado al momento.",
      price,
      {
        popular:
          id === "frappe-oreo" ||
          id === "mangonada" ||
          id === "mojito-fresa",
        featured:
          id === "frappe-nutella" ||
          id === "azulitos" ||
          id === "mojito-frutos-rojos",
      },
    ),
  ),
];
