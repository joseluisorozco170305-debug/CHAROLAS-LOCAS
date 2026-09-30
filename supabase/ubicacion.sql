-- Ejecutar este script completo en: Supabase -> SQL Editor -> New query
-- (script NUEVO, adicional a los anteriores)

-- 1) Nueva columna para guardar el enlace de Google Maps de la ubicación
--    que elige el cliente al hacer su pedido.
alter table pedidos
  add column if not exists ubicacion_url text;

-- 2) La función que crea el pedido ahora también recibe el enlace.
--    Se elimina la versión anterior para que no haya dos funciones iguales.
drop function if exists crear_pedido(text, jsonb, text, numeric);

create or replace function crear_pedido(
  p_nombre text,
  p_items jsonb,
  p_zona text,
  p_total numeric,
  p_ubicacion_url text default null
)
returns pedidos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fecha date;
  v_siguiente int;
  v_pedido pedidos;
begin
  v_fecha := (now() at time zone 'America/Mexico_City')::date;

  lock table pedidos in exclusive mode;

  select coalesce(max(numero_pedido), 0) + 1
  into v_siguiente
  from pedidos
  where fecha = v_fecha;

  insert into pedidos (
    numero_pedido, fecha, nombre_cliente, items, zona_entrega, total, ubicacion_url
  )
  values (
    v_siguiente, v_fecha, p_nombre, p_items, p_zona, p_total, p_ubicacion_url
  )
  returning * into v_pedido;

  return v_pedido;
end;
$$;

-- 3) Ya no existe la página pública de estatus, así que el público deja de
--    poder LEER pedidos (ahora guardan nombre y ubicación de los clientes).
--    Crear pedidos sigue funcionando (pasa por la función de arriba) y el
--    equipo con sesión iniciada sigue viendo todo en /admin.
drop policy if exists "lectura_publica_del_dia" on pedidos;
