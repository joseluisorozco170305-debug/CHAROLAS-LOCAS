export type EstatusPedido = "recibido" | "preparando" | "listo" | "entregado";

export interface PedidoDB {
  id: string;
  numero_pedido: number;
  fecha: string;
  nombre_cliente: string;
  items: unknown;
  zona_entrega: string | null;
  total: number;
  estatus: EstatusPedido;
  created_at: string;
}
