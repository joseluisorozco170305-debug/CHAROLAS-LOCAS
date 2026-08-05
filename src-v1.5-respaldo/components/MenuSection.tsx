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

      const searchMatches =
        !normalizedSearch ||
        productSearchText(product).includes(normalizedSearch);

      return categoryMatches && searchMatches;
    });
  }, [category, favoriteIds, normalizedSearch]);

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
    <section id="menu" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-[.22em] text-pink-600">
            Nuestro menú
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Elige y personaliza tu antojo
          </h2>

          <p className="mt-3 text-slate-600">
            Busca por nombre, categoría, descripción o ingrediente.
          </p>
        </div>

        <div className="mb-10 rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 via-pink-50 to-fuchsia-50 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-orange-500" />
            <h3 className="text-lg font-black text-slate-900">
              Los más pedidos
            </h3>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {featuredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProduct(product)}
                className="min-w-48 rounded-2xl border border-white bg-white/85 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-2xl">
                  {iconForCategory(product.categoryId)}
                </span>
                <p className="mt-2 font-black text-slate-900">
                  {product.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-pink-600">
                  Ver opciones
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mb-7 max-w-2xl">
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
              className="w-full rounded-2xl border border-pink-100 bg-white py-4 pl-12 pr-12 shadow-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
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

        <div className="mb-10 flex gap-2 overflow-x-auto pb-3">
          <button
            type="button"
            onClick={() => setCategory("todos")}
            className={`shrink-0 rounded-full px-5 py-3 text-sm font-black ${
              category === "todos"
                ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                : "bg-white text-slate-600 ring-1 ring-pink-100"
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
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                  : "bg-white text-pink-600 ring-1 ring-pink-100"
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
              onClick={() => setCategory(item.id)}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-black ${
                category === item.id
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                  : "bg-white text-slate-600 ring-1 ring-pink-100"
              }`}
            >
              {item.icono} {item.nombre}
            </button>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                : "No encontramos productos"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {category === "favoritos"
                ? "Toca el corazón de cualquier producto para guardarlo."
                : "Prueba con otro nombre, ingrediente o categoría."}
            </p>
          </div>
        )}

        {category === "bebidas" && (
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
                  Los mojitos mostrados en la página corresponden a versiones
                  sin alcohol. Las variantes con alcohol se gestionan únicamente
                  fuera de la página por una persona adulta, con verificación de
                  mayoría de edad y solo para servicio a domicilio.
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
