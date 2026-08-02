export interface Option { id:string; name:string; price:number }
export interface Group { id:string; title:string; min:number; max:number; options:Option[] }
export interface Size { id:string; name:string; price:number; rules?:Record<string,{min:number;max:number}> }
export interface Product { id:string; categoryId:string; name:string; description:string; available:boolean; popular?:boolean; basePrice?:number; sizes?:Size[]; groups?:Group[]; fixed?:string[] }
export interface CartSelection { title:string; options:Option[] }
export interface CartItem { id:string; productName:string; categoryId:string; sizeName?:string; selections:CartSelection[]; quantity:number; normalUnitPrice:number; subtotal:number; notes?:string }
