import { Minus, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import {
  calculateNormalUnitPrice,
  createEmptyConfiguration,
  getResolvedRule,
  toggleOption,
  validateConfiguration,
} from "../services/menuEngine";
import { discountedPrice } from "../services/promotionEngine";
import type { MenuProduct } from "../types/product";
import { formatPrice } from "../utils/formatPrice";

interface ProductConfiguratorProps {
  product: MenuProduct;
  onClose: () => void;
}

export function ProductConfigurator({
  product,
  onClose,
}: ProductConfiguratorProps) {
  const [configuration, setConfiguration] = useState(() =>
    createEmptyConfiguration(product),
  );

  const { addItem } = useCart();

  const normalUnitPrice = useMemo(
    () => calculateNormalUnitPrice(product, configuration),
    [product, configuration],
  );

  const finalUnitPrice = discountedPrice(normalUnitPrice, product.categoryId);
  const errors = validateConfiguration(product, configuration);
  const total = finalUnitPrice * configuration.quantity;
  const asksMangoAvailability =
    `${product.name} ${product.description}`
      .toLocaleLowerCase("es-MX")
      .includes("mango");

  const isMojito = product.id.startsWith("mojito-");

  const addToCart = () => {
    if (errors.length > 0) {
      return;
    }

    const size = product.sizes?.find(
      (item) => item.id === configuration.sizeId,
    );

    const selections = (product.groups ?? [])
      .map((group) => ({
        groupId: group.id,
        groupTitle: group.title,
        options: (configuration.selectedOptions[group.id] ?? [])
          .map((id) => group.options.find((option) => option.id === id))
          .filter(
            (option): option is NonNullable<typeof option> => Boolean(option),
          ),
      }))
      .filter((selection) => selection.options.length > 0);

    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      categoryId: product.categoryId,
      sizeId: size?.id,
      sizeName: size?.name,
      selections,
      quantity: configuration.quantity,
      normalUnitPrice,
      finalUnitPrice,
      subtotal: total,
      notes: configuration.notes,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-pink-100 bg-white/95 p-6 backdrop-blur">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {product.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-7 p-6">
          {asksMangoAvailability && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              🥭 Este producto contiene mango. Pregunta por disponibilidad antes
              de confirmar tu pedido.
            </div>
          )}

          {isMojito && (
            <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4 text-sm text-fuchsia-950">
              <p className="font-black">
                🍹 Versión con alcohol: +$20
              </p>
              <p className="mt-2 leading-6">
                Se solicita únicamente por WhatsApp, con verificación de mayoría
                de edad y solo para servicio a domicilio. El precio mostrado en
                la página corresponde a la versión sin alcohol.
              </p>
            </div>
          )}

          {product.sizes?.length ? (
            <section>
              <h4 className="font-black text-slate-900">Elige un tamaño</h4>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() =>
                      setConfiguration((current) => ({
                        ...current,
                        sizeId: size.id,
                        selectedOptions: Object.fromEntries(
                          (product.groups ?? []).map((group) => [group.id, []]),
                        ),
                      }))
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      configuration.sizeId === size.id
                        ? "border-pink-500 bg-pink-50 ring-2 ring-pink-100"
                        : "border-slate-200 hover:border-pink-300"
                    }`}
                  >
                    <p className="font-black text-slate-900">{size.name}</p>
                    <p className="mt-1 font-black text-pink-600">
                      {formatPrice(
                        discountedPrice(size.price, product.categoryId),
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {(product.groups ?? []).map((group) => {
            const selected = configuration.selectedOptions[group.id] ?? [];
            const rule = getResolvedRule(
              product,
              group,
              configuration.sizeId,
            );

            return (
              <section key={group.id}>
                <h4 className="font-black text-slate-900">{group.title}</h4>

                <p className="text-xs font-semibold text-slate-500">
                  {rule.required ? "Obligatorio" : "Opcional"} · Seleccionados{" "}
                  {selected.length} de {rule.max}
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {group.options.map((option) => {
                    const active = selected.includes(option.id);
                    const disabled =
                      !active && rule.max > 1 && selected.length >= rule.max;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          setConfiguration((current) => ({
                            ...current,
                            selectedOptions: {
                              ...current.selectedOptions,
                              [group.id]: toggleOption(
                                product,
                                group,
                                current.selectedOptions[group.id] ?? [],
                                option.id,
                                current.sizeId,
                              ),
                            },
                          }))
                        }
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-pink-500 bg-pink-50 text-pink-800"
                            : "border-slate-200 text-slate-700 hover:border-pink-300"
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        <span className="font-bold">{option.name}</span>

                        {option.price > 0 && (
                          <span className="text-sm font-black">
                            +{formatPrice(option.price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <textarea
            value={configuration.notes}
            onChange={(event) =>
              setConfiguration((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            placeholder="Nota para el pedido..."
            className="min-h-24 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          />

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <strong>Cantidad</strong>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setConfiguration((current) => ({
                    ...current,
                    quantity: Math.max(1, current.quantity - 1),
                  }))
                }
                className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm"
              >
                <Minus size={18} />
              </button>

              <span className="min-w-8 text-center text-lg font-black">
                {configuration.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setConfiguration((current) => ({
                    ...current,
                    quantity: current.quantity + 1,
                  }))
                }
                className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              {errors[0]}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-pink-100 bg-white/95 p-5 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>
            <p className="text-2xl font-black text-pink-600">
              {formatPrice(total)}
            </p>
          </div>

          <button
            type="button"
            disabled={errors.length > 0}
            onClick={addToCart}
            className="rounded-2xl bg-pink-600 px-6 py-4 font-black text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Agregar al pedido
          </button>
        </div>
      </div>
    </div>
  );
}
