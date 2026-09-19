import { supabase } from "../lib/supabaseClient";
import { fechaMexicoISO } from "../utils/fecha";
import type { CartItem } from "../types/cart";
import type { EstatusPedido, PedidoDB } from "../types/pedido";

const hoyISO = () => fechaMexicoISO();

interface CrearPedidoInput {
  nombreCliente: string;
  items: CartItem[];
  zonaEntrega: string;
  total: number;
}

/**
 * Crea el pedido llamando a la función de Supabase "crear_pedido", que
 * asigna el número de pedido consecutivo del día de forma segura
 * (sin choques aunque dos personas ordenen al mismo tiempo).
 */
export const crearPedido = async ({
  nombreCliente,
  items,
  zonaEntrega,
  total,
}: CrearPedidoInput): Promise<PedidoDB> => {
  const { data, error } = await supabase.rpc("crear_pedido", {
    p_nombre: nombreCliente,
    p_items: items,
    p_zona: zonaEntrega,
    p_total: total,
  });

  if (error || !data) {
    throw error ?? new Error("No se pudo crear el pedido.");
  }

  return data as PedidoDB;
};

export const buscarPedidoDeHoy = async (
  numeroPedido: number,
): Promise<PedidoDB | null> => {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("numero_pedido", numeroPedido)
    .eq("fecha", hoyISO())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as PedidoDB) ?? null;
};

export const listarPedidosDeHoy = async (): Promise<PedidoDB[]> => {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("fecha", hoyISO())
    .order("numero_pedido", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as PedidoDB[]) ?? [];
};

export const listarPedidosPorFecha = async (
  fecha: string,
): Promise<PedidoDB[]> => {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("fecha", fecha)
    .order("numero_pedido", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as PedidoDB[]) ?? [];
};

export const actualizarEstatusPedido = async (
  id: string,
  estatus: EstatusPedido,
) => {
  const { error } = await supabase
    .from("pedidos")
    .update({ estatus })
    .eq("id", id);

  if (error) {
    throw error;
  }
};

/**
 * Se suscribe a los cambios de UN pedido específico (para la página
 * pública de estatus, que se actualiza sola cuando el negocio cambia
 * el estatus).
 */
export const suscribirseAPedido = (
  pedidoId: string,
  onChange: (pedido: PedidoDB) => void,
) => {
  const channel = supabase
    .channel(`pedido-${pedidoId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "pedidos",
        filter: `id=eq.${pedidoId}`,
      },
      (payload) => onChange(payload.new as PedidoDB),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Se suscribe a TODOS los cambios de pedidos (para el panel del
 * negocio, que se refresca solo con pedidos nuevos o cambios de estatus).
 */
export const suscribirseATodosLosPedidos = (onChange: () => void) => {
  const channel = supabase
    .channel("pedidos-admin")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "pedidos" },
      onChange,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
