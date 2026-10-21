import { supabase } from "../lib/supabaseClient";

export interface ArticuloCompra {
  id: string;
  producto: string;
  cantidad: string | null;
  comprado: boolean;
  agregado_por: string | null;
  created_at: string;
}

export const listarCompras = async (): Promise<ArticuloCompra[]> => {
  const { data, error } = await supabase
    .from("lista_compras")
    .select("*")
    .order("comprado", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ArticuloCompra[]) ?? [];
};

export const agregarCompra = async (producto: string, cantidad: string) => {
  const { data: sesion } = await supabase.auth.getUser();
  const { error } = await supabase.from("lista_compras").insert({
    producto,
    cantidad: cantidad || null,
    agregado_por: sesion.user?.email ?? null,
  });
  if (error) throw error;
};

export const marcarComprado = async (id: string, comprado: boolean) => {
  const { error } = await supabase
    .from("lista_compras")
    .update({ comprado })
    .eq("id", id);
  if (error) throw error;
};

export const borrarCompra = async (id: string) => {
  const { error } = await supabase.from("lista_compras").delete().eq("id", id);
  if (error) throw error;
};

export const borrarComprados = async () => {
  const { error } = await supabase
    .from("lista_compras")
    .delete()
    .eq("comprado", true);
  if (error) throw error;
};

export const suscribirseACompras = (onChange: () => void) => {
  const channel = supabase
    .channel("lista-compras")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "lista_compras" },
      onChange,
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
};
