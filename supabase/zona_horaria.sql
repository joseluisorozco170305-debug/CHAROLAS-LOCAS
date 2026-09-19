-- Ejecutar este script completo en: Supabase -> SQL Editor -> New query
-- (script NUEVO, adicional a los anteriores)

-- 1) La función que crea el pedido y asigna el número consecutivo ahora
--    calcula el "día" según la hora de Ciudad de México, no UTC.
create or replace function crear_pedido(
  p_nombre text,
  p_items jsonb,
  p_zona text,
  p_total numeric
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

  insert into pedidos (numero_pedido, fecha, nombre_cliente, items, zona_entrega, total)
  values (v_siguiente, v_fecha, p_nombre, p_items, p_zona, p_total)
  returning * into v_pedido;

  return v_pedido;
end;
$$;

-- 2) La columna "fecha" también usa hora de México si algún día se
--    inserta sin pasar por la función de arriba.
alter table pedidos
  alter column fecha set default (now() at time zone 'America/Mexico_City')::date;

-- 3) La política de "solo hoy" para el público (pantalla de estatus)
--    también se recalcula con hora de México.
drop policy if exists "lectura_publica_del_dia" on pedidos;

create policy "lectura_publica_del_dia"
  on pedidos for select
  to anon, authenticated
  using (fecha = (now() at time zone 'America/Mexico_City')::date);
