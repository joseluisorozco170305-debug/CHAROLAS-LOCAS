export type AplicaSobre = "producto" | "total";

export interface CodigoDescuento {
  id: string;
  codigo: string;
  porcentaje: number;
  aplica_sobre: AplicaSobre;
  activo: boolean;
  created_at: string;
}

/** Lo que necesita el carrito para calcular el descuento. */
export type CodigoAplicado = Pick<
  CodigoDescuento,
  "codigo" | "porcentaje" | "aplica_sobre"
>;
