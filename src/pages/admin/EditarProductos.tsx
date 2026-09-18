import { useMemo, useState } from "react";
import { categorias } from "../../data/categorias";
import { useMenuConPrecios } from "../../hooks/useMenuConPrecios";
import { guardarDescripcion, guardarPrecio } from "../../services/productosService";
import type { MenuProduct } from "../../types/product";

function FilaProducto({ product }: { product: MenuProduct }) {
  const [descripcion, setDescripcion] = useState(product.description);
  const [precios, setPrecios] = useState<Record<string, string>>(() =>
    product.sizes
      ? Object.fromEntries(
          product.sizes.map((size) => [size.id, String(size.price)]),
        )
      : { "": String(product.basePrice ?? 0) },
  );
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const handleGuardar = async () => {
    setGuardando(true);
    setGuardado(false);

    try {
      await guardarDescripcion(product.id, descripcion.trim());

      const tamanos = product.sizes
        ? product.sizes.map((size) => size.id)
        : [""];

      for (const tamanoId of tamanos) {
        const valor = Number(precios[tamanoId]);

        if (!Number.isNaN(valor) && valor >= 0) {
          await guardarPrecio(product.id, tamanoId, valor);
        }
      }

      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch {
      window.alert("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-5">
      <p className="font-black text-slate-900">{product.name}</p>

      <label className="mt-3 block text-xs font-bold uppercase text-slate-500">
        Descripción
      </label>
      <textarea
        value={descripcion}
        onChange={(event) => setDescripcion(event.target.value)}
        rows={2}
        className="mt-1 w-full rounded-2xl border border-pink-200 p-3 text-sm outline-none"
      />

      <label className="mt-3 block text-xs font-bold uppercase text-slate-500">
        {product.sizes ? "Precios por tamaño" : "Precio"}
      </label>

      <div className="mt-1 flex flex-wrap gap-3">
        {product.sizes ? (
          product.sizes.map((size) => (
            <div key={size.id} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                {size.name}
              </span>
              <input
                type="number"
                min={0}
                value={precios[size.id] ?? ""}
                onChange={(event) =>
                  setPrecios((valores) => ({
                    ...valores,
                    [size.id]: event.target.value,
                  }))
                }
                className="w-24 rounded-xl border border-pink-200 p-2 text-sm font-bold outline-none"
              />
            </div>
          ))
        ) : (
          <input
            type="number"
            min={0}
            value={precios[""] ?? ""}
            onChange={(event) =>
              setPrecios((valores) => ({ ...valores, "": event.target.value }))
            }
            className="w-28 rounded-xl border border-pink-200 p-2 text-sm font-bold outline-none"
          />
        )}
      </div>

      <button
        type="button"
        onClick={handleGuardar}
        disabled={guardando}
        className="mt-4 rounded-xl bg-pink-600 px-4 py-2 text-sm font-black text-white disabled:bg-slate-300"
      >
        {guardando
          ? "Guardando..."
          : guardado
            ? "Guardado ✓"
            : "Guardar cambios"}
      </button>
    </div>
  );
}

export function EditarProductos() {
  const menu = useMenuConPrecios();
  const [categoria, setCategoria] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return menu.filter((product) => {
      const categoriaOk =
        categoria === "todos" || product.categoryId === categoria;
      const busquedaOk = !texto || product.name.toLowerCase().includes(texto);

      return categoriaOk && busquedaOk;
    });
  }, [menu, categoria, busqueda]);

  return (
    <div>
      <p className="text-sm text-slate-600">
        Cambia el precio o la descripción de cualquier producto; se refleja
        en la página de inmediato para tus clientes.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar producto..."
          className="flex-1 rounded-2xl border border-pink-200 bg-white p-3 text-sm font-bold outline-none"
        />

        <select
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          className="rounded-2xl border border-pink-200 bg-white p-3 text-sm font-bold outline-none"
        >
          <option value="todos">Todas las categorías</option>
          {categorias.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {productosFiltrados.map((product) => (
          <FilaProducto key={product.id} product={product} />
        ))}

        {!productosFiltrados.length && (
          <p className="text-slate-500">No encontramos productos.</p>
        )}
      </div>
    </div>
  );
}
