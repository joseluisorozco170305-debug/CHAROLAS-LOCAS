import type { MenuProduct, ProductOption } from "../types/product";
import { frutas } from "./frutas";
import { toppings } from "./toppings";
import { jarabes } from "./jarabes";
import {
  extrasDulces,
  extrasFrutasConCrema,
} from "./extras";

const getOptions = (
  source: ProductOption[],
  ids?: string[],
): ProductOption[] => {
  if (!ids) return source;

  return source.filter((option) => ids.includes(option.id));
};

const fruitCreamSizes = [
  {
    id: "mini",
    name: "Mini (1/4)",
    price: 60,
    description: "Incluye chantilly y 1 topping.",
    groupRules: {
      toppings: {
        required: true,
        min: 1,
        max: 1,
      },
    },
  },
  {
    id: "chico",
    name: "Chico (1/2 litro)",
    price: 100,
    description: "Incluye chantilly y 2 toppings.",
    groupRules: {
      toppings: {
        required: true,
        min: 2,
        max: 2,
      },
    },
  },
  {
    id: "grande",
    name: "Grande (1 litro)",
    price: 195,
    description: "Elige hasta 5 toppings.",
    groupRules: {
      toppings: {
        required: false,
        min: 0,
        max: 5,
      },
    },
  },
];

const fruitCreamGroups = [
  {
    id: "toppings",
    title: "Elige tus toppings",
    required: true,
    min: 1,
    max: 1,
    options: toppings,
  },
  {
    id: "extras",
    title: "Extras opcionales",
    required: false,
    min: 0,
    max: extrasFrutasConCrema.length,
    options: extrasFrutasConCrema,
  },
];

export const menu: MenuProduct[] = [
  {
    id: "fresas-con-crema",
    categoryId: "todo-con-crema",
    name: "Fresas con crema",
    description:
      "Fresas preparadas con crema, toppings y chantilly.",
    type: "fruitCream",
    available: true,
    popular: true,
    featured: true,
    tags: ["Popular", "Miércoles 20%"],
    sizes: fruitCreamSizes,
    groups: fruitCreamGroups,
    fixedIngredients: ["Fresa", "Crema"],
    notes: [
      "Incluye 1 chocolate de regalo.",
      "La promoción de miércoles se calcula automáticamente.",
    ],
  },

  {
    id: "duraznos-con-crema",
    categoryId: "todo-con-crema",
    name: "Duraznos con crema",
    description:
      "Duraznos preparados con crema, toppings y chantilly.",
    type: "fruitCream",
    available: true,
    tags: ["Dulce"],
    sizes: fruitCreamSizes,
    groups: fruitCreamGroups,
    fixedIngredients: ["Durazno", "Crema"],
    notes: ["Incluye 1 chocolate de regalo."],
  },

  {
    id: "platanos-con-crema",
    categoryId: "todo-con-crema",
    name: "Plátanos con crema",
    description:
      "Plátanos preparados con crema, toppings y chantilly.",
    type: "fruitCream",
    available: true,
    tags: ["Dulce"],
    sizes: fruitCreamSizes,
    groups: fruitCreamGroups,
    fixedIngredients: ["Plátano", "Crema"],
    notes: ["Incluye 1 chocolate de regalo."],
  },

  {
    id: "uvas-con-crema",
    categoryId: "todo-con-crema",
    name: "Uvas con crema",
    description:
      "Uvas preparadas con crema, toppings y chantilly.",
    type: "fruitCream",
    available: true,
    popular: true,
    tags: ["Popular"],
    sizes: [
      {
        id: "mini",
        name: "Mini (1/4)",
        price: 70,
        description: "Incluye chantilly y 1 topping.",
        groupRules: {
          toppings: {
            required: true,
            min: 1,
            max: 1,
          },
        },
      },
      {
        id: "chico",
        name: "Chico (1/2 litro)",
        price: 110,
        description: "Incluye chantilly y 2 toppings.",
        groupRules: {
          toppings: {
            required: true,
            min: 2,
            max: 2,
          },
        },
      },
      {
        id: "grande",
        name: "Grande (1 litro)",
        price: 215,
        description: "Elige hasta 5 toppings.",
        groupRules: {
          toppings: {
            required: false,
            min: 0,
            max: 5,
          },
        },
      },
    ],
    groups: fruitCreamGroups,
    fixedIngredients: ["Uva", "Crema"],
    notes: ["Incluye 1 chocolate de regalo."],
  },

  {
    id: "frutas-combinadas-con-crema",
    categoryId: "todo-con-crema",
    name: "Frutas combinadas con crema",
    description:
      "Combinación de frutas con crema, toppings y chantilly.",
    type: "fruitCream",
    available: true,
    popular: true,
    sizes: [
      {
        id: "mini",
        name: "Mini (1/4)",
        price: 65,
        groupRules: {
          frutas: {
            required: true,
            min: 2,
            max: 4,
          },
          toppings: {
            required: true,
            min: 1,
            max: 1,
          },
        },
      },
      {
        id: "chico",
        name: "Chico (1/2 litro)",
        price: 105,
        groupRules: {
          frutas: {
            required: true,
            min: 2,
            max: 4,
          },
          toppings: {
            required: true,
            min: 2,
            max: 2,
          },
        },
      },
      {
        id: "grande",
        name: "Grande (1 litro)",
        price: 215,
        groupRules: {
          frutas: {
            required: true,
            min: 2,
            max: 4,
          },
          toppings: {
            required: false,
            min: 0,
            max: 5,
          },
        },
      },
    ],
    groups: [
      {
        id: "frutas",
        title: "Elige las frutas",
        required: true,
        min: 2,
        max: 4,
        options: getOptions(frutas, [
          "fresa",
          "durazno",
          "platano",
          "uva",
        ]),
      },
      {
        id: "toppings",
        title: "Elige tus toppings",
        required: true,
        min: 1,
        max: 1,
        options: toppings,
      },
      {
        id: "extras",
        title: "Extras opcionales",
        required: false,
        min: 0,
        max: extrasFrutasConCrema.length,
        options: extrasFrutasConCrema,
      },
    ],
    fixedIngredients: ["Crema"],
    notes: ["Incluye 1 chocolate de regalo."],
  },

  {
    id: "brocheta-dulce",
    categoryId: "todo-con-crema",
    name: "Brocheta dulce",
    description:
      "Brocheta con cobertura de chocolate y un topping a elegir.",
    type: "fruitCream",
    available: true,
    basePrice: 45,
    groups: [
      {
        id: "variedad",
        title: "Elige la variedad",
        required: true,
        min: 1,
        max: 1,
        options: [
          { id: "uva", name: "Uva", price: 0 },
          { id: "fresa", name: "Fresa", price: 0 },
          { id: "bombones", name: "Bombones", price: 0 },
          {
            id: "mini-hotcakes",
            name: "Mini Hotcakes",
            price: 0,
          },
          {
            id: "combinada",
            name: "Combinada",
            price: 0,
          },
        ],
      },
      {
        id: "toppings",
        title: "Elige 1 topping",
        required: true,
        min: 1,
        max: 1,
        options: toppings,
      },
    ],
    fixedIngredients: ["Cobertura de chocolate"],
  },

  {
    id: "concha-rellena",
    categoryId: "todo-con-crema",
    name: "Concha rellena",
    description:
      "Concha rellena con fruta y crema, topping y chantilly.",
    type: "fruitCream",
    available: true,
    basePrice: 45,
    groups: [
      {
        id: "sabor-concha",
        title: "Elige el sabor de la concha",
        required: true,
        min: 1,
        max: 1,
        options: [
          {
            id: "chocolate",
            name: "Chocolate",
            price: 0,
          },
          {
            id: "vainilla",
            name: "Vainilla",
            price: 0,
          },
        ],
      },
      {
        id: "relleno",
        title: "Elige el relleno",
        required: true,
        min: 1,
        max: 1,
        options: [
          {
            id: "fresas-con-crema",
            name: "Fresas con crema",
            price: 0,
          },
          {
            id: "duraznos-con-crema",
            name: "Duraznos con crema",
            price: 0,
          },
        ],
      },
      {
        id: "toppings",
        title: "Elige 1 topping",
        required: true,
        min: 1,
        max: 1,
        options: toppings,
      },
    ],
    fixedIngredients: ["Crema", "Chantilly"],
  },

  {
    id: "mini-hotcakes",
    categoryId: "dulces",
    name: "Mini Hotcakes",
    description:
      "Mini hotcakes personalizados con frutas, toppings y jarabes.",
    type: "hotcakes",
    available: true,
    popular: true,
    featured: true,
    tags: ["Popular"],
    sizes: [
      {
        id: "chica",
        name: "Chica · 15 piezas",
        price: 65,
        groupRules: {
          frutas: {
            required: true,
            min: 1,
            max: 1,
          },
          toppings: {
            required: true,
            min: 1,
            max: 1,
          },
          jarabes: {
            required: true,
            min: 1,
            max: 1,
          },
        },
      },
      {
        id: "mediana",
        name: "Mediana · 18 piezas",
        price: 75,
        groupRules: {
          frutas: {
            required: true,
            min: 2,
            max: 2,
          },
          toppings: {
            required: true,
            min: 2,
            max: 2,
          },
          jarabes: {
            required: true,
            min: 2,
            max: 2,
          },
        },
      },
      {
        id: "grande",
        name: "Grande · 22 piezas",
        price: 90,
        groupRules: {
          frutas: {
            required: true,
            min: 3,
            max: 3,
          },
          toppings: {
            required: true,
            min: 3,
            max: 3,
          },
          jarabes: {
            required: true,
            min: 3,
            max: 3,
          },
        },
      },
      {
        id: "extra-grande",
        name: "Extra Grande · 33 piezas",
        price: 135,
        groupRules: {
          frutas: {
            required: false,
            min: 0,
            max: 5,
          },
          toppings: {
            required: false,
            min: 0,
            max: 5,
          },
          jarabes: {
            required: false,
            min: 0,
            max: 5,
          },
        },
      },
    ],
    groups: [
      {
        id: "frutas",
        title: "Elige tus frutas",
        required: true,
        min: 1,
        max: 1,
        options: getOptions(frutas, [
          "fresa",
          "uva",
          "blueberry",
          "durazno",
          "platano",
          "frambuesa",
          "zarzamora",
        ]),
      },
      {
        id: "toppings",
        title: "Elige tus toppings",
        required: true,
        min: 1,
        max: 1,
        options: toppings,
      },
      {
        id: "jarabes",
        title: "Elige tus jarabes",
        required: true,
        min: 1,
        max: 1,
        options: jarabes,
      },
      {
        id: "extras",
        title: "Extras opcionales",
        required: false,
        min: 0,
        max: extrasDulces.length,
        options: extrasDulces,
      },
    ],
  },

  {
    id: "mini-waffles",
    categoryId: "dulces",
    name: "Mini Waffles",
    description:
      "Mini waffles personalizados con frutas, toppings y jarabes.",
    type: "waffles",
    available: true,
    popular: true,
    sizes: [
      {
        id: "chica",
        name: "Chica · 15 piezas",
        price: 70,
        groupRules: {
          frutas: { required: true, min: 1, max: 1 },
          toppings: { required: true, min: 1, max: 1 },
          jarabes: { required: true, min: 1, max: 1 },
        },
      },
      {
        id: "mediana",
        name: "Mediana · 20 piezas",
        price: 85,
        groupRules: {
          frutas: { required: true, min: 2, max: 2 },
          toppings: { required: true, min: 2, max: 2 },
          jarabes: { required: true, min: 2, max: 2 },
        },
      },
      {
        id: "grande",
        name: "Grande · 25 piezas",
        price: 100,
        groupRules: {
          frutas: { required: true, min: 3, max: 3 },
          toppings: { required: true, min: 3, max: 3 },
          jarabes: { required: true, min: 3, max: 3 },
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
    groups: [
      {
        id: "frutas",
        title: "Elige tus frutas",
        required: true,
        min: 1,
        max: 1,
        options: getOptions(frutas, [
          "fresa",
          "uva",
          "blueberry",
          "durazno",
          "platano",
          "frambuesa",
          "zarzamora",
        ]),
      },
      {
        id: "toppings",
        title: "Elige tus toppings",
        required: true,
        min: 1,
        max: 1,
        options: toppings,
      },
      {
        id: "jarabes",
        title: "Elige tus jarabes",
        required: true,
        min: 1,
        max: 1,
        options: jarabes,
      },
      {
        id: "extras",
        title: "Extras opcionales",
        required: false,
        min: 0,
        max: extrasDulces.length,
        options: extrasDulces,
      },
    ],
  },

  {
    id: "waffle-tradicional",
    categoryId: "dulces",
    name: "Waffle tradicional",
    description:
      "Waffle acompañado de 2 frutas, 1 topping y 1 jarabe.",
    type: "waffles",
    available: true,
    basePrice: 90,
    groups: [
      {
        id: "frutas",
        title: "Elige 2 frutas",
        required: true,
        min: 2,
        max: 2,
        options: getOptions(frutas, [
          "fresa",
          "uva",
          "blueberry",
          "durazno",
          "platano",
          "frambuesa",
          "zarzamora",
        ]),
      },
      {
        id: "toppings",
        title: "Elige 1 topping",
        required: true,
        min: 1,
        max: 1,
        options: toppings,
      },
      {
        id: "jarabes",
        title: "Elige 1 jarabe",
        required: true,
        min: 1,
        max: 1,
        options: jarabes,
      },
      {
        id: "extras",
        title: "Extras opcionales",
        required: false,
        min: 0,
        max: extrasDulces.length,
        options: extrasDulces,
      },
    ],
  },
];