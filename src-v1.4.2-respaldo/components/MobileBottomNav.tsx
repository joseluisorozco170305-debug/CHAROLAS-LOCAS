import { Home, Menu, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { whatsappUrl } from "../utils/whatsapp";

interface Props { onOpenCart: () => void; }

export function MobileBottomNav({ onOpenCart }: Props) {
  const { items } = useCart();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-pink-100 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        <a href="#inicio" className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-black text-slate-600"><Home size={20}/>Inicio</a>
        <a href="#menu" className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-black text-slate-600"><Menu size={20}/>Menú</a>
        <button type="button" onClick={onOpenCart} className="relative flex flex-col items-center gap-1 rounded-xl bg-pink-50 px-2 py-2 text-xs font-black text-pink-700"><ShoppingBag size={20}/>Pedido{items.length>0&&<span className="absolute right-4 top-1 rounded-full bg-orange-500 px-1.5 text-[10px] text-white">{items.length}</span>}</button>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-black text-emerald-600"><MessageCircle size={20}/>WhatsApp</a>
      </div>
    </nav>
  );
}
