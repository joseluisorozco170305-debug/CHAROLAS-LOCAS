import panDeMuertoImg from "../assets/promos/pan-de-muerto.png";
import { estaVigente } from "../utils/fecha";
import { temporadaPanDeMuerto } from "./temporadas";

export interface Promo {
  id: string;
  /** Etiqueta pequeña sobre el título. */
  etiqueta: string;
  titulo: string;
  descripcion: string;
  /** Puntos destacados (opcional). */
  puntos?: string[];
  /** Imagen de la promo (guárdala en src/assets/promos/). */
  imagen: string;
  /** Texto del botón. */
  boton: string;
  /** Categoría del menú a la que lleva el botón (opcional). */
  categoriaId?: string;
  /** Fechas (AAAA-MM-DD, inclusive). Fuera de este rango la promo se oculta sola. */
  desde?: string;
  hasta?: string;
}

/**
 * Para agregar una promo: copia la imagen a src/assets/promos/, impórtala
 * arriba y agrega un objeto a esta lista. Para quitarla, bórrala o deja que
 * venza sola con la fecha "hasta".
 */
export const promos: Promo[] = [
  {
    id: "pan-de-muerto",
    etiqueta: "Venta especial",
    titulo: "Pan de Muerto",
    descripcion:
      "Relleno de fresa, uva, durazno, plátano o frutos rojos con crema, chantilly, 1 topping y 1 jarabe.",
    puntos: [
      "Mini $25 · Tradicional $50",
      "Frappé + Pan desde $75",
      "Chocolate caliente + Pan desde $70",
      "Extra de Queso Philadelphia +$10",
    ],
    imagen: panDeMuertoImg,
    boton: "Pedir Pan de Muerto",
    categoriaId: "pan-de-muerto",
    desde: temporadaPanDeMuerto.desde,
    hasta: temporadaPanDeMuerto.hasta,
  },
];

export const promosVigentes = () =>
  promos.filter((promo) => estaVigente(promo.desde, promo.hasta));
