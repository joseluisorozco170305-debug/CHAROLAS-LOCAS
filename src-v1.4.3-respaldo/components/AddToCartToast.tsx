import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export function AddToCartToast() {
  const { lastAddedName, clearLastAdded } = useCart();
  useEffect(() => {
    if (!lastAddedName) return;
    const timer = window.setTimeout(clearLastAdded, 2200);
    return () => window.clearTimeout(timer);
  }, [lastAddedName, clearLastAdded]);
  if (!lastAddedName) return null;
  return (
    <div className="fixed left-1/2 top-24 z-[70] -translate-x-1/2">
      <div className="flex min-w-72 items-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-2xl">
        <CheckCircle2 size={22} className="text-emerald-400" />
        <div><p className="text-sm font-black">Agregado al pedido</p><p className="text-xs text-slate-300">{lastAddedName}</p></div>
      </div>
    </div>
  );
}
