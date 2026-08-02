import { config } from "../data/config";
import type { CartItem, Product, Group } from "../types";

export const money=(n:number)=>new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n);
export const isWednesday=()=>new Intl.DateTimeFormat("en-US",{timeZone:config.timezone,weekday:"long"}).format(new Date())==="Wednesday";
export const discountFor=(categoryId:string)=>isWednesday()&&categoryId==="todo-con-crema"?20:0;
export const finalPrice=(price:number,categoryId:string)=>Math.round(price*(1-discountFor(categoryId)/100));
export const whatsapp=(message="Hola, quiero hacer un pedido.")=>`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

export const ruleFor=(product:Product,group:Group,sizeId?:string)=>{
 const size=product.sizes?.find(s=>s.id===sizeId);
 return size?.rules?.[group.id]??{min:group.min,max:group.max};
};
export const unitPrice=(product:Product,sizeId:string|undefined,selected:Record<string,string[]>)=>{
 let total=product.sizes?.find(s=>s.id===sizeId)?.price??product.basePrice??0;
 for(const group of product.groups??[]) for(const id of selected[group.id]??[]) total+=group.options.find(o=>o.id===id)?.price??0;
 return total;
};
export const orderText=(items:CartItem[],subtotal:number,discount:number,total:number)=>{
 const lines=["🍓 *CHAROLAS LOCAS*","","Quiero hacer el siguiente pedido:",""];
 items.forEach((item,i)=>{
   lines.push(`${i+1}. *${item.quantity} x ${item.productName}*`);
   if(item.sizeName) lines.push(`Tamaño: ${item.sizeName}`);
   item.selections.forEach(s=>lines.push(`${s.title}: ${s.options.map(o=>o.name).join(", ")}`));
   if(item.notes) lines.push(`Nota: ${item.notes}`);
   lines.push(`Subtotal: ${money(item.subtotal)}`,"");
 });
 lines.push(`Subtotal: ${money(subtotal)}`);
 if(discount>0) lines.push(`Descuento: -${money(discount)}`);
 lines.push(`*TOTAL: ${money(total)}*`);
 return lines.join("\n");
};
