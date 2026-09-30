import { supabase } from "../lib/supabaseClient";
import type {
  AplicaSobre,
  CodigoAplicado,
  CodigoDescuento,
} from "../types/codigo";

/**
 * Valida un código escrito por el cliente. Usa la función "validar_codigo"
 * de Supabase, así el público puede probar un código pero NUNCA ver la lista.
 * Devuelve null si no existe o está desactivado.
 */
export const validarCodigo = async (
  codigo: string,
): Promise<CodigoAplicado | null> => {
  const { data, error } = await supabase.rpc("validar_codigo", {
    p_codigo: codigo.trim(),
  });

  if (error) {
    throw error;
  }

  const fila = Array.isArray(data) ? data[0] : data;

  return fila ? (fila as CodigoAplicado) : null;
};

// ----- Panel del equipo (requiere sesión iniciada) -----

export const listarCodigos = async (): Promise<CodigoDescuento[]> => {
  const { data, error } = await supabase
    .from("codigos_descuento")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as CodigoDescuento[]) ?? [];
};

export const crearCodigo = async (input: {
  codigo: string;
  porcentaje: number;
  aplica_sobre: AplicaSobre;
}) => {
  const { error } = await supabase.from("codigos_descuento").insert({
    codigo: input.codigo.trim().toUpperCase(),
    porcentaje: input.porcentaje,
    aplica_sobre: input.aplica_sobre,
  });

  if (error) {
    throw error;
  }
};

export const cambiarActivoCodigo = async (id: string, activo: boolean) => {
  const { error } = await supabase
    .from("codigos_descuento")
    .update({ activo })
    .eq("id", id);

  if (error) {
    throw error;
  }
};

export const eliminarCodigo = async (id: string) => {
  const { error } = await supabase
    .from("codigos_descuento")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};
