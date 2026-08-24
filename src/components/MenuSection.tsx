import {
  AlertTriangle,
  Heart,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { categorias } from "../data/categorias";
import { menu } from "../data/menu";
import { useFavorites } from "../hooks/useFavorites";
import type { MenuProduct } from "../types/product";
import { ProductCard } from "./ProductCard";
import { ProductConfigurator } from "./ProductConfigurator";

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const drinkSubcategory = (product: MenuProduct) => {
  const id = product.id;

  if (id === "aguas-frescas") return "aguas";
  if (id.startsWith("licuado-")) return "licuados";
  if (id.startsWith("frappe-") || id.startsWith("malteada-")) return "frappes";

  if (
    [
      "azulitos",
      "mangonada",
      "ice-cereza",
      "ice-mora-azul",
      "picafresa-con-mango",
      "frappe-fresas-con-crema",
    ].includes(id)
  ) {
    return "especiales";
  }

  return "drinks";
};

const productSearchText = (product: MenuProduct) => {
  const categoryName =
    categorias.find((item) => item.id === product.categoryId)?.nombre ?? "";

  const groupText = (product.groups ?? [])
    .flatMap((group) => [
      group.title,
      ...group.options.map((option) => option.name),
    ])
    .join(" ");

  const sizeText = (product.sizes ?? [])
    .map((size) => size.name)
    .join(" ");

  return normalize(
    [
      product.name,
      product.description,
      categoryName,
      groupText,
      sizeText,
      ...(product.fixedIngredients ?? []),
    ].join(" "),
  );
};

export function MenuSection() {
  const [category, setCategory] = useState("todos");
  const [drinkSection, setDrinkSection] = useState("frappes");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<MenuProduct | null>(null);

  const {
    favoriteIds,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const normalizedSearch = normalize(search.trim());

  const products = useMemo(() => {
    return menu.filter((product) => {
      const categoryMatches =
        category === "todos" ||
        (category === "favoritos"
          ? favoriteIds.includes(product.id)
          : product.categoryId === category);

      const drinkSectionMatches =
        category !== "bebidas" ||
        drinkSubcategory(product) === drinkSection;

      const searchMatches =
        !normalizedSearch ||
        productSearchText(product).includes(normalizedSearch);

      return categoryMatches && drinkSectionMatches && searchMatches;
    });
  }, [category, drinkSection, favoriteIds, normalizedSearch]);

  const featuredProducts = menu
    .filter((product) => product.featured || product.popular)
    .slice(0, 5);

  const suggestions = useMemo(() => {
    if (!normalizedSearch) return [];

    return menu
      .filter((product) =>
        productSearchText(product).includes(normalizedSearch),
      )
      .slice(0, 5);
  }, [normalizedSearch]);

  const iconForCategory = (categoryId: string) =>
    categorias.find((item) => item.id === categoryId)?.icono ?? "🍽️";

  return (
    <section id="menu" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-pink-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-40 h-72 w-72 rounded-full bg-fuchsia-200/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-2xl opacity-30">💗 ✨ 💕</div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-11 max-w-3xl text-center">
          <p className="soft-heading text-base font-extrabold tracking-[.08em] text-pink-500">
            Nuestro menú
          </p>

          <h2 className="soft-heading mt-2 text-4xl font-black leading-tight text-rose-950 sm:text-5xl">
            Elige y personaliza tu antojo
          </h2>

          <p className="mt-3 text-base font-semibold text-rose-950/60 sm:text-lg">
            Busca por nombre, categoría, descripción o ingrediente.
          </p>
        </div>

        <div className="mb-10 rounded-[2rem] border border-pink-100 bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 p-5 shadow-[0_14px_35px_rgba(244,114,182,0.10)] sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-orange-500" />
            <h3 className="soft-heading text-xl font-black text-rose-950">
              Los más pedidos
            </h3>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {featuredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProduct(product)}
                className="min-w-52 rounded-[1.35rem] border border-white bg-white/90 p-4 text-left shadow-[0_8px_20px_rgba(244,114,182,0.09)] transition hover:-translate-y-1 hover:border-pink-100 hover:shadow-[0_12px_26px_rgba(244,114,182,0.14)]"
              >
                <span className="text-2xl">
                  {iconForCategory(product.categoryId)}
                </span>
                <p className="soft-heading mt-2 font-extrabold text-rose-950">
                  {product.name}
                </p>
                <p className="mt-1 text-xs font-extrabold text-pink-500">
                  Ver opciones
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mb-8 max-w-3xl">
          <label className="relative block">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="¿Qué se te antoja hoy?"
              className="w-full rounded-[1.4rem] border border-pink-100 bg-white/95 py-4 pl-12 pr-12 font-semibold text-rose-950 shadow-[0_8px_24px_rgba(244,114,182,0.08)] outline-none placeholder:text-rose-300 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            )}
          </label>

          {suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-2xl">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSearch(product.name);
                    setSelectedProduct(product);
                  }}
                  className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-pink-50"
                >
                  <span className="text-2xl">
                    {iconForCategory(product.categoryId)}
                  </span>

                  <div>
                    <p className="font-black text-slate-900">{product.name}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      {product.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="menu-scroll mb-10 flex gap-2.5 overflow-x-auto pb-3">
          <button
            type="button"
            onClick={() => setCategory("todos")}
            className={`shrink-0 rounded-full px-5 py-3 text-sm font-black ${
              category === "todos"
                ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-200"
                : "bg-white/90 text-rose-950/70 ring-1 ring-pink-100 hover:bg-pink-50"
            }`}
          >
            ✨ Todos
          </button>

          {favoriteIds.length > 0 && (
            <button
              type="button"
              onClick={() => setCategory("favoritos")}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-black ${
                category === "favoritos"
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-200"
                  : "bg-white/90 text-pink-500 ring-1 ring-pink-100 hover:bg-pink-50"
              }`}
            >
              <Heart
                size={16}
                fill={category === "favoritos" ? "currentColor" : "none"}
              />
              Mis favoritos
            </button>
          )}

          {categorias.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCategory(item.id);
                if (item.id === "bebidas") {
                  setDrinkSection("frappes");
                }
              }}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-black ${
                category === item.id
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-200"
                  : "bg-white/90 text-rose-950/70 ring-1 ring-pink-100 hover:bg-pink-50"
              }`}
            >
              {item.icono} {item.nombre}
            </button>
          ))}
        </div>

        {category === "bebidas" && (
          <div className="mb-8 rounded-[1.75rem] border border-pink-100 bg-white/90 p-4 shadow-[0_10px_28px_rgba(244,114,182,0.08)]">
            <p className="soft-heading mb-3 text-center text-sm font-extrabold tracking-[.08em] text-pink-500">
              Elige el tipo de bebida
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                ["licuados", "🥛 Licuados"],
                ["frappes", "🧋 Frappés"],
                ["especiales", "✨ Especiales"],
                ["aguas", "💧 Aguas"],
                ["drinks", "🍹 Drinks"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDrinkSection(id)}
                  className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    drinkSection === id
                      ? "bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white shadow-lg shadow-pink-200"
                      : "bg-pink-50 text-slate-700 hover:bg-pink-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                icon={iconForCategory(product.categoryId)}
                onCustomize={setSelectedProduct}
                favorite={isFavorite(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-pink-300 bg-pink-50 p-10 text-center">
            <p className="text-5xl">
              {category === "favoritos" ? "❤️" : "🔍"}
            </p>
            <p className="mt-4 text-xl font-black text-pink-700">
              {category === "favoritos"
                ? "Todavía no tienes favoritos"
                : category === "bebidas"
                  ? "No encontramos bebidas en esta sección"
                  : "No encontramos productos"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {category === "favoritos"
                ? "Toca el corazón de cualquier producto para guardarlo."
                : "Prueba con otro nombre, ingrediente o categoría."}
            </p>
          </div>
        )}

        {category === "bebidas" && drinkSection === "drinks" && (
          <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertTriangle size={21} />
              </div>

              <div>
                <h3 className="font-black text-amber-900">
                  Información sobre bebidas con alcohol
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-950/80">
                  Los precios publicados corresponden a mojitos sin alcohol.
                  La versión con alcohol tiene un costo adicional de $20 y se
                  gestiona únicamente por WhatsApp, con verificación de mayoría
                  de edad y solo para servicio a domicilio.
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-red-700">
                  En el establecimiento no se vende alcohol ni se permite el
                  ingreso con bebidas alcohólicas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductConfigurator
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
