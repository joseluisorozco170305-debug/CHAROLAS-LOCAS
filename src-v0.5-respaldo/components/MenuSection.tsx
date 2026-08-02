import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categorias } from "../data/categorias";
import { menu } from "../data/menu";
import type { MenuProduct } from "../types/product";
import { ProductCard } from "./ProductCard";
import { ProductConfigurator } from "./ProductConfigurator";

export function MenuSection() {
  const [category, setCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<MenuProduct | null>(null);

  const products = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es-MX");

    return menu.filter((product) => {
      const categoryMatches =
        category === "todos" || product.categoryId === category;

      const searchMatches =
        !normalizedSearch ||
        product.name
          .toLocaleLowerCase("es-MX")
          .includes(normalizedSearch) ||
        product.description
          .toLocaleLowerCase("es-MX")
          .includes(normalizedSearch);

      return categoryMatches && searchMatches;
    });
  }, [category, search]);

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
            Incluye Todo con crema, Dulces, Snacks, Charolas y Drinks.
          </p>
        </div>

        <div className="mx-auto mb-7 max-w-2xl">
          <label className="relative block">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar fresas, boneless, frappé..."
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
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-pink-300 bg-pink-50 p-10 text-center">
            <p className="text-5xl">🔍</p>
            <p className="mt-4 text-xl font-black text-pink-700">
              No encontramos productos
            </p>
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
