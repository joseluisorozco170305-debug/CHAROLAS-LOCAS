import { Cookie, House, PackageSearch, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface Props {
  onOpenCart: () => void;
}

export function MobileBottomNav({ onOpenCart }: Props) {
  const { items } = useCart();

  const itemClass =
    "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black text-slate-500 transition active:scale-95";

  const badgeClass =
    "grid h-9 w-9 place-items-center rounded-2xl bg-pink-50 text-slate-500 transition";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-pink-100 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        <a href="#inicio" className={itemClass}>
          <span className={badgeClass}>
            <House size={19} />
          </span>
          Inicio
        </a>

        <a href="#menu" className={itemClass}>
          <span className={badgeClass}>
            <Cookie size={19} />
          </span>
          Menú
        </a>

        <button type="button" onClick={onOpenCart} className={itemClass}>
          <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-200">
            <ShoppingBag size={19} />
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                {items.length}
              </span>
            )}
          </span>
          <span className="text-pink-600">Pedido</span>
        </button>

        <Link to="/estatus" className={itemClass}>
          <span className={badgeClass}>
            <PackageSearch size={19} />
          </span>
          Estatus
        </Link>
      </div>
    </nav>
  );
}
