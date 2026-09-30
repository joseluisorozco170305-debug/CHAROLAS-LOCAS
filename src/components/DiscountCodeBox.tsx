import { Check, Tag, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCart } from "../context/CartContext";
import { validarCodigo } from "../services/codigosService";

/**
 * Apartado discreto para códigos de descuento (al final del menú).
 * Se ve como un texto pequeño y se abre solo si la persona lo toca.
 */
export function DiscountCodeBox() {
  const { codigo, applyCode, removeCode } = useCart();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!value.trim()) return;

    setChecking(true);
    setError(null);

    try {
      const result = await validarCodigo(value);

      if (!result) {
        setError("Ese código no es válido o ya no está activo.");
        return;
      }

      applyCode(result);
      setValue("");
      setOpen(false);
    } catch {
      setError("No pudimos revisar el código. Intenta de nuevo.");
    } finally {
      setChecking(false);
    }
  };

  if (codigo) {
    return (
      <div className="mt-14 flex flex-col items-center gap-1 text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-emerald-200">
          <Check size={16} />
          Código {codigo.codigo} aplicado · {codigo.porcentaje}% sobre{" "}
          {codigo.aplica_sobre === "producto" ? "los productos" : "el total"}
          <button
            type="button"
            onClick={removeCode}
            aria-label="Quitar código"
            className="grid h-6 w-6 place-items-center rounded-full text-emerald-600 hover:bg-emerald-100"
          >
            <X size={14} />
          </button>
        </p>
        <p className="text-xs font-semibold text-slate-400">
          Lo verás reflejado en tu pedido.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-14 text-center">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-pink-500"
        >
          <Tag size={12} />
          ¿Tienes un código de descuento?
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-xs items-center gap-2"
        >
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(event) => {
              setValue(event.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Escribe tu código"
            autoCapitalize="characters"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm font-bold uppercase tracking-wide text-slate-700 outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-300 focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
          />

          <button
            type="submit"
            disabled={checking || !value.trim()}
            className="rounded-xl bg-pink-500 px-3 py-2 text-sm font-black text-white transition hover:bg-pink-600 disabled:bg-pink-200"
          >
            {checking ? "..." : "Aplicar"}
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
              setValue("");
            }}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </form>
      )}

      {error && (
        <p className="mt-2 text-xs font-bold text-red-500">{error}</p>
      )}
    </div>
  );
}
