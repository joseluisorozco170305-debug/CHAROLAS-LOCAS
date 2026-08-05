import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { shippingZones } from "../data/envios";
import { buildOrderMessage, whatsappUrl } from "../utils/whatsapp";
import { formatPrice } from "../utils/formatPrice";

interface Props { open: boolean; onClose: () => void; }

export function CartDrawer({ open, onClose }: Props) {
  const { items, subtotal, discount, total, removeItem, updateQuantity, clearCart } = useCart();
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [customShipping, setCustomShipping] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const selectedZone = shippingZones.find((zone) => zone.id === selectedZoneId);
  const shippingCost = useMemo(() => {
    if (!selectedZone) return 0;
    if (selectedZone.cost !== null) return selectedZone.cost;
    const parsed = Number(customShipping);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [selectedZone, customShipping]);
  const grandTotal = total + shippingCost;
  if (!open) return null;
  const shippingLabel = selectedZone ? `${selectedZone.zone} (${selectedZone.displayCost})` : "Sin zona seleccionada";
  const finalMessage = [buildOrderMessage(items, subtotal, discount, total), "", `Zona de envío: ${shippingLabel}`, `Costo de envío: ${formatPrice(shippingCost)}`, `*TOTAL CON ENVÍO: ${formatPrice(grandTotal)}*`].join("\n");
  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm" onClick={onClose}>
        <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onClick={(e)=>e.stopPropagation()}>
          <header className="flex items-center justify-between border-b border-pink-100 p-5">
            <div><p className="text-sm font-black uppercase tracking-wide text-pink-600">Tu pedido</p><h2 className="text-2xl font-black text-slate-900">{items.length} producto(s)</h2></div>
            <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100"><X size={20}/></button>
          </header>
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {!items.length ? <div className="grid min-h-72 place-items-center text-center"><div><ShoppingBag className="mx-auto text-pink-300" size={54}/><p className="mt-4 font-black">Tu pedido está vacío</p></div></div> : items.map((item)=>(
              <article key={item.id} className="rounded-3xl border border-pink-100 p-5">
                <div className="flex justify-between gap-4"><div><h3 className="font-black">{item.productName}</h3>{item.sizeName&&<p className="text-sm font-semibold text-pink-600">{item.sizeName}</p>}</div><button onClick={()=>removeItem(item.id)} className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500"><Trash2 size={17}/></button></div>
                {item.selections.map((s)=><p key={s.groupId} className="mt-2 text-sm text-slate-600"><strong>{s.groupTitle}:</strong> {s.options.map((o)=>o.name).join(", ")}</p>)}
                <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1"><button onClick={()=>updateQuantity(item.id,item.quantity-1)} className="grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm"><Minus size={16}/></button><span className="min-w-8 text-center font-black">{item.quantity}</span><button onClick={()=>updateQuantity(item.id,item.quantity+1)} className="grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm"><Plus size={16}/></button></div><p className="text-lg font-black text-pink-600">{formatPrice(item.subtotal)}</p></div>
              </article>
            ))}
            {items.length>0&&<div className="rounded-3xl border border-orange-100 bg-orange-50 p-5"><h3 className="font-black">Zona de envío</h3><select value={selectedZoneId} onChange={(e)=>{setSelectedZoneId(e.target.value);setCustomShipping("");}} className="mt-3 w-full rounded-2xl border border-orange-200 bg-white p-3 font-bold"><option value="">Selecciona tu zona</option>{shippingZones.map((z)=><option key={z.id} value={z.id}>{z.zone} · {z.displayCost}</option>)}</select>{selectedZone?.cost===null&&<input type="number" min="0" value={customShipping} onChange={(e)=>setCustomShipping(e.target.value)} placeholder="Costo acordado, ej. 25" className="mt-3 w-full rounded-2xl border border-orange-200 bg-white p-3 font-bold"/>}</div>}
          </div>
          <footer className="border-t border-pink-100 p-5"><div className="space-y-2"><div className="flex justify-between"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>{discount>0&&<div className="flex justify-between text-pink-600"><span>Descuento</span><strong>-{formatPrice(discount)}</strong></div>}<div className="flex justify-between"><span>Envío</span><strong>{formatPrice(shippingCost)}</strong></div><div className="flex justify-between text-xl font-black"><span>Total</span><span>{formatPrice(grandTotal)}</span></div></div><div className="mt-5 grid gap-3"><button disabled={!items.length} onClick={()=>setConfirmOpen(true)} className="rounded-2xl bg-emerald-500 px-5 py-4 font-black text-white disabled:bg-slate-300">Revisar y enviar</button>{items.length>0&&<button onClick={()=>window.confirm("¿Vaciar todo el pedido?")&&clearCart()} className="text-sm font-bold text-red-500">Vaciar pedido</button>}</div></footer>
        </aside>
      </div>
      {confirmOpen&&<div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"><div className="flex justify-between"><div><p className="text-sm font-black uppercase text-pink-600">Confirmación</p><h3 className="text-2xl font-black">Revisa tu pedido</h3></div><button onClick={()=>setConfirmOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><X size={18}/></button></div><div className="mt-5 space-y-3">{items.map((item)=><div key={item.id} className="rounded-2xl bg-pink-50 p-4"><div className="flex justify-between"><strong>{item.quantity} x {item.productName}</strong><strong className="text-pink-600">{formatPrice(item.subtotal)}</strong></div></div>)}</div><div className="mt-5 space-y-2 rounded-2xl bg-slate-950 p-5 text-white"><div className="flex justify-between"><span>Zona</span><strong>{selectedZone?.zone??"Pendiente"}</strong></div><div className="flex justify-between"><span>Envío</span><strong>{formatPrice(shippingCost)}</strong></div><div className="flex justify-between text-xl"><span>Total</span><strong>{formatPrice(grandTotal)}</strong></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={()=>setConfirmOpen(false)} className="rounded-2xl bg-slate-100 px-5 py-4 font-black">Seguir editando</button><a href={whatsappUrl(finalMessage)} target="_blank" rel="noreferrer" className="rounded-2xl bg-emerald-500 px-5 py-4 text-center font-black text-white">Enviar por WhatsApp</a></div></div></div>}
    </>
  );
}
