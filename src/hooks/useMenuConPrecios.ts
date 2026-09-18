import { useEffect, useState } from "react";
import { menu as menuBase } from "../data/menu";
import {
  listarDescripcionesOverride,
  listarPreciosOverride,
} from "../services/productosService";
import type { MenuProduct } from "../types/product";

/**
 * Devuelve el menú con los precios y descripciones que el negocio haya
 * editado desde /admin. Mientras carga (o si falla), regresa el menú tal
 * como está en el código, así que la tienda nunca se queda sin mostrar
 * precios.
 */
export const useMenuConPrecios = () => {
  const [menuActual, setMenuActual] = useState<MenuProduct[]>(menuBase);

  useEffect(() => {
    let cancelado = false;

    Promise.all([listarPreciosOverride(), listarDescripcionesOverride()])
      .then(([precios, descripciones]) => {
        if (cancelado || (!precios.length && !descripciones.length)) {
          return;
        }

        const precioPorClave = new Map(
          precios.map((item) => [
            `${item.producto_id}:${item.tamano_id}`,
            item.precio,
          ]),
        );
        const descripcionPorProducto = new Map(
          descripciones.map((item) => [item.producto_id, item.descripcion]),
        );

        setMenuActual(
          menuBase.map((producto) => {
            const description =
              descripcionPorProducto.get(producto.id) ?? producto.description;

            if (producto.sizes) {
              return {
                ...producto,
                description,
                sizes: producto.sizes.map((size) => ({
                  ...size,
                  price:
                    precioPorClave.get(`${producto.id}:${size.id}`) ??
                    size.price,
                })),
              };
            }

            return {
              ...producto,
              description,
              basePrice:
                precioPorClave.get(`${producto.id}:`) ?? producto.basePrice,
            };
          }),
        );
      })
      .catch(() => {
        // Si falla la consulta, se queda con los valores del código.
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return menuActual;
};
