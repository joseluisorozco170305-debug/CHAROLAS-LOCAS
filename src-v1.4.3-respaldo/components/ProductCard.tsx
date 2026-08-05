import { Flame, Sparkles } from "lucide-react";
import type { MenuProduct } from "../types/product";
import { discountedPrice, discountPercent } from "../services/promotionEngine";
import { formatPrice } from "../utils/formatPrice";

interface ProductCardProps {
  product: MenuProduct;
  icon: string;
  onCustomize: (product: MenuProduct) => void;
}

const startingPrice = (product: MenuProduct) =>
  product.sizes?.length
    ? Math.min(...product.sizes.map((size) => size.price))
    : product.basePrice ?? 0;

export function ProductCard({
  product,
  icon,
  onCustomize,
}: ProductCardProps) {
  const normalPrice = startingPrice(product);
  const finalPrice = discountedPrice(normalPrice, product.categoryId);
  const discount = discountPercent(product.categoryId);
  const asksMangoAvailability =
    `${product.name} ${product.description}`
      .toLocaleLowerCase("es-MX")
      .includes("mango");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100">
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-orange-100 p-6">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/50" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/80 text-4xl shadow-sm">
            {icon}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {product.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">
                <Flame size={13} />
                Popular
              </span>
            )}

            {product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-600 px-3 py-1 text-xs font-black text-white">
                <Sparkles size={13} />
                Destacado
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900">{product.name}</h3>

          {asksMangoAvailability && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">
              🥭 Preguntar por disponibilidad
            </div>
          )}

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {product.description}
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
          <div>
            {product.sizes?.length ? (
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Desde
              </p>
            ) : null}

            {discount > 0 && (
              <p className="text-sm font-bold text-slate-400 line-through">
                {formatPrice(normalPrice)}
              </p>
            )}

            <p className="text-2xl font-black text-pink-600">
              {formatPrice(finalPrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCustomize(product)}
            className="rounded-2xl bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700"
          >
            Personalizar
          </button>
        </div>
      </div>
    </article>
  );
}
