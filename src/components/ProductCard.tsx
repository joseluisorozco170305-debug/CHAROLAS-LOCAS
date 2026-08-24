import { Flame, Heart, Sparkles, WandSparkles } from "lucide-react";
import type { MenuProduct } from "../types/product";
import { discountedPrice, discountPercent } from "../services/promotionEngine";
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

  return (
    <article className="group product-card-soft flex h-full flex-col overflow-hidden rounded-[2rem] border border-pink-100/90 bg-white/95 shadow-[0_14px_40px_rgba(244,114,182,0.10)] transition duration-300 hover:-translate-y-1.5 hover:border-pink-200 hover:shadow-[0_22px_55px_rgba(236,72,153,0.16)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 px-6 pb-5 pt-6">
        <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-pink-200/35 blur-sm" />
        <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-fuchsia-100/70" />
        <div className="absolute right-16 top-4 text-sm opacity-60">💗</div>
        <div className="absolute bottom-5 right-7 text-xs opacity-50">✨</div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="product-emoji grid h-24 w-24 place-items-center rounded-[2rem] border border-white/90 bg-white/85 text-6xl shadow-[0_10px_25px_rgba(236,72,153,0.12)] transition duration-300 group-hover:scale-105 group-hover:-rotate-2">
            {emoji}
          </div>

          <div className="flex min-w-0 flex-col items-end gap-2">
            <button
              type="button"
              aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={() => onToggleFavorite(product.id)}
              className={`grid h-11 w-11 place-items-center rounded-2xl border shadow-sm transition active:scale-95 ${
                favorite
                  ? "border-pink-300 bg-pink-500 text-white shadow-pink-200"
                  : "border-white bg-white/95 text-pink-500 hover:bg-pink-50"
              }`}
            >
              <Heart size={20} fill={favorite ? "currentColor" : "none"} />
            </button>

            <div className="flex max-w-[9rem] flex-wrap justify-end gap-1.5">
              {product.popular && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                  <Flame size={12} />
                  Popular
                </span>
              )}

              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                  <Sparkles size={12} />
                  Destacado
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3 className="soft-heading text-[1.35rem] font-extrabold leading-tight text-rose-950">
            {product.name}
          </h3>

          {asksMangoAvailability && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-extrabold text-amber-800">
              🥭 Preguntar por disponibilidad
            </div>
          )}

          <p className="mt-2 text-sm leading-6 text-rose-950/65">
            {product.description}
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-pink-100 pt-5">
          <div>
            {product.sizes?.length ? (
              <p className="text-[11px] font-black uppercase tracking-[.16em] text-pink-400">
                Desde
              </p>
            ) : null}

            {discount > 0 && (
              <p className="text-sm font-bold text-slate-400 line-through">
                {formatPrice(normalPrice)}
              </p>
            )}

            <p className="soft-heading text-3xl font-black text-pink-500">
              {formatPrice(finalPrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCustomize(product)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-black text-white shadow-[0_10px_22px_rgba(236,72,153,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(236,72,153,0.30)] active:translate-y-0"
          >
            <WandSparkles size={16} />
            Personalizar
          </button>
        </div>
      </div>
    </article>
  );
}
