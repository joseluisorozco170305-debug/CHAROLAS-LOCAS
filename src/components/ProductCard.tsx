import { Clock3, Flame, Heart, Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import type { MenuProduct } from "../types/product";
import { discountedPrice, discountPercent } from "../services/promotionEngine";
import { fechaLarga } from "../utils/fecha";
import { formatPrice } from "../utils/formatPrice";

interface ProductCardProps {
  product: MenuProduct;
  icon: string;
  onCustomize: (product: MenuProduct) => void;
  favorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

const startingPrice = (product: MenuProduct) =>
  product.sizes?.length
    ? Math.min(...product.sizes.map((size) => size.price))
    : product.basePrice ?? 0;

const productEmoji = (product: MenuProduct, fallback: string) => {
  const id = product.id.toLowerCase();
  const name = product.name.toLocaleLowerCase("es-MX");

  if (id === "pan-de-muerto") return "🍞";

  if (id.includes("fresa") || name.includes("fresa")) return "🍓";
  if (id.includes("uva") || name.includes("uva")) return "🍇";
  if (id.includes("durazno") || name.includes("durazno")) return "🍑";
  if (id.includes("platano") || name.includes("plátano")) return "🍌";
  if (id.includes("mango") || name.includes("mango")) return "🥭";
  if (id.includes("sandia") || name.includes("sandía")) return "🍉";
  if (id.includes("manzana") || name.includes("manzana")) return "🍎";
  if (id.includes("oreo") || name.includes("oreo")) return "🍪";
  if (id.includes("chocolate") || name.includes("chocolate")) return "🍫";
  if (id.includes("vainilla") || name.includes("vainilla")) return "🍦";
  if (id.includes("mazapan") || name.includes("mazapán")) return "🥜";
  if (id.includes("nutella") || name.includes("nutella")) return "🍫";
  if (id.includes("carlos-v") || name.includes("carlos v")) return "🍫";
  if (id.includes("baileys") || name.includes("baileys")) return "🥤";
  if (id.includes("kinder") || name.includes("kinder")) return "🍫";
  if (id.includes("frappe") || name.includes("frappé")) return "🧋";
  if (id.includes("malteada") || name.includes("malteada")) return "🥤";
  if (id.includes("licuado") || name.includes("licuado")) return "🥛";
  if (id.includes("mojito") || name.includes("mojito")) return "🍹";
  if (id.includes("azulito") || name.includes("azulito")) return "🧊";
  if (id.includes("agua") || name.includes("agua fresca")) return "🧃";
  if (id.includes("coca") || id.includes("sidral") || id.includes("squirt") || id.includes("sangria") || id.includes("penafiel") || id.includes("manzanita") || id.includes("mirinda") || id.includes("refresco")) return "🥤";

  if (id.includes("hamburguesa") || name.includes("hamburguesa")) return "🍔";
  if (id.includes("papas") || name.includes("papas")) return "🍟";
  if (id.includes("alitas") || name.includes("alitas")) return "🍗";
  if (id.includes("boneless") || name.includes("boneless")) return "🍗";
  if (id.includes("tenders") || name.includes("tenders")) return "🍗";
  if (id.includes("nuggets") || name.includes("nuggets")) return "🍗";
  if (id.includes("aros") || name.includes("aros")) return "🧅";
  if (id.includes("nachos") || name.includes("nachos")) return "🧀";
  if (id.includes("salchi") || name.includes("salchi")) return "🌭";
  if (id.includes("dedos-queso") || name.includes("dedos de queso")) return "🧀";

  if (id.includes("hotcake") || name.includes("hotcake")) return "🥞";
  if (id.includes("waffle") || name.includes("waffle")) return "🧇";
  if (id.includes("crepa") || name.includes("crepa")) return "🥞";
  if (id.includes("concha") || name.includes("concha")) return "🥐";
  if (id.includes("brocheta")) return "🍡";
  if (id.includes("chicharron") || name.includes("chicharrón")) return "🥨";
  if (id.includes("maruch") || name.includes("maru")) return "🍜";
  if (id.includes("charola") || name.includes("charola")) return "🍱";
  if (id.includes("combo") || name.includes("combo")) return "🍽️";
  if (id.includes("gomiboing")) return "🧃";
  if (id.includes("dorilocos")) return "🌶️";
  if (id.includes("pepinos")) return "🥒";
  if (id.includes("fresada")) return "🍓";

  return fallback;
};

export function ProductCard({
  product,
  icon,
  onCustomize,
  favorite,
  onToggleFavorite,
}: ProductCardProps) {
  const normalPrice = startingPrice(product);
  const finalPrice = discountedPrice(normalPrice, product.categoryId);
  const discount = discountPercent(product.categoryId);
  const asksMangoAvailability =
    `${product.name} ${product.description}`
      .toLocaleLowerCase("es-MX")
      .includes("mango");

  const emoji = productEmoji(product, icon);
  const sizeCount = product.sizes?.length ?? 0;
  const hasOptions = (product.groups?.length ?? 0) > 0;
  const fromPrice = sizeCount > 1;

  return (
    <article className="group relative flex h-full flex-col rounded-[1.75rem] border border-pink-100 bg-white p-5 shadow-[0_8px_30px_rgba(244,114,182,0.08)] transition duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_18px_45px_rgba(236,72,153,0.16)] focus-within:ring-4 focus-within:ring-pink-100">
      {/* Toda la tarjeta abre el producto */}
      <button
        type="button"
        onClick={() => onCustomize(product)}
        aria-label={`Ver y personalizar ${product.name}`}
        className="absolute inset-0 z-0 rounded-[1.75rem] outline-none"
      />

      <div className="pointer-events-none relative flex items-start gap-4">
        <div className="product-emoji grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-[1.4rem] bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 text-[2.6rem] ring-1 ring-pink-100 transition duration-300 group-hover:scale-105 group-hover:-rotate-3">
          {emoji}
        </div>

        <div className="min-w-0 flex-1 pr-10">
          {(product.popular || product.featured || discount > 0) && (
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {discount > 0 && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                  -{discount}%
                </span>
              )}
              {product.popular && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-orange-700">
                  <Flame size={11} />
                  Popular
                </span>
              )}
              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-fuchsia-700">
                  <Sparkles size={11} />
                  Destacado
                </span>
              )}
            </div>
          )}

          <h3 className="soft-heading text-lg font-extrabold leading-snug text-rose-950">
            {product.name}
          </h3>
        </div>
      </div>

      <button
        type="button"
        aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        aria-pressed={favorite}
        onClick={() => onToggleFavorite(product.id)}
        className={`absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full transition active:scale-90 ${
          favorite
            ? "bg-pink-500 text-white shadow-md shadow-pink-200"
            : "bg-pink-50 text-pink-400 hover:bg-pink-100 hover:text-pink-500"
        }`}
      >
        <Heart size={17} fill={favorite ? "currentColor" : "none"} />
      </button>

      <p className="pointer-events-none relative mt-3 flex-1 text-sm leading-6 text-rose-950/65">
        {product.description}
      </p>

      {(sizeCount > 1 || hasOptions || asksMangoAvailability || product.availableUntil) && (
        <div className="pointer-events-none relative mt-3 flex flex-wrap gap-1.5">
          {sizeCount > 1 && (
            <span className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-500 ring-1 ring-slate-100">
              {sizeCount} tamaños
            </span>
          )}
          {hasOptions && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-500 ring-1 ring-slate-100">
              <SlidersHorizontal size={11} />
              Personalizable
            </span>
          )}
          {asksMangoAvailability && (
            <span className="rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-100">
              🥭 Pregunta disponibilidad
            </span>
          )}
          {product.availableUntil && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-100">
              <Clock3 size={11} />
              Hasta el {fechaLarga(product.availableUntil)}
            </span>
          )}
        </div>
      )}

      <div className="pointer-events-none relative mt-4 flex items-end justify-between gap-3 border-t border-dashed border-pink-100 pt-4">
        <div className="leading-none">
          {fromPrice && (
            <p className="mb-1 text-[10px] font-black uppercase tracking-[.16em] text-pink-400">
              Desde
            </p>
          )}

          <div className="flex items-baseline gap-2">
            <p className="soft-heading text-2xl font-black text-pink-600">
              {formatPrice(finalPrice)}
            </p>

            {discount > 0 && (
              <p className="text-sm font-bold text-slate-400 line-through">
                {formatPrice(normalPrice)}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onCustomize(product)}
          className="pointer-events-auto relative z-10 inline-flex h-11 items-center gap-1.5 rounded-full bg-pink-600 pl-3 pr-4 text-sm font-black text-white shadow-[0_8px_18px_rgba(236,72,153,0.28)] transition hover:bg-pink-700 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Agregar
        </button>
      </div>
    </article>
  );
}
