import { supabase } from "../lib/supabaseClient";

export interface PrecioOverride {
  producto_id: string;
  tamano_id: string;
  precio: number;
}

export interface DescripcionOverride {
  producto_id: string;
  descripcion: string;
}

export const listarPreciosOverride = async (): Promise<PrecioOverride[]> => {
  const { data, error } = await supabase.from("precios_productos").select("*");

  if (error) {
    throw error;
  }

  return (data as PrecioOverride[]) ?? [];
};

export const listarDescripcionesOverride = async (): Promise<
  DescripcionOverride[]
> => {
  const { data, error } = await supabase
    .from("descripciones_productos")
    .select("*");

  if (error) {
    throw error;
  }

  return (data as DescripcionOverride[]) ?? [];
};

export const guardarPrecio = async (
  productoId: string,
  tamanoId: string,
  precio: number,
) => {
  const { error } = await supabase.from("precios_productos").upsert({
    producto_id: productoId,
    tamano_id: tamanoId,
    precio,
    actualizado_en: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
};

export const guardarDescripcion = async (
  productoId: string,
  descripcion: string,
) => {
  const { error } = await supabase.from("descripciones_productos").upsert({
    producto_id: productoId,
    descripcion,
    actualizado_en: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
};
