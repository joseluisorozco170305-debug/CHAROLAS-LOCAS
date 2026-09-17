-- Ejecutar este script completo en: Supabase -> SQL Editor -> New query

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_pedido int not null,
  fecha date not null default current_date,
  nombre_cliente text not null,
  items jsonb not null,
  zona_entrega text,
  total numeric not null,
  estatus text not null default 'recibido'
    check (estatus in ('recibido', 'preparando', 'listo', 'entregado')),
  created_at timestamptz not null default now()
);

create unique index if not exists pedidos_fecha_numero_idx
  on pedidos (fecha, numero_pedido);

-- Asigna el número de pedido consecutivo del día de forma segura
-- (evita que dos pedidos al mismo tiempo se queden con el mismo número)
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
  v_siguiente int;
  v_pedido pedidos;
begin
  lock table pedidos in exclusive mode;

  select coalesce(max(numero_pedido), 0) + 1
  into v_siguiente
  from pedidos
  where fecha = current_date;

  insert into pedidos (numero_pedido, fecha, nombre_cliente, items, zona_entrega, total)
  values (v_siguiente, current_date, p_nombre, p_items, p_zona, p_total)
  returning * into v_pedido;

  return v_pedido;
end;
$$;

alter table pedidos enable row level security;

-- Cualquiera puede CONSULTAR pedidos del día (para la pantalla de estatus).
-- No se permite insertar ni actualizar directo a la tabla desde el público:
-- crear pedidos solo pasa por la función de arriba, y actualizar el estatus
-- solo lo puede hacer alguien con sesión iniciada (el equipo, abajo).
create policy "lectura_publica_del_dia"
  on pedidos for select
  to anon, authenticated
  using (fecha = current_date);

create policy "actualizar_estatus_equipo"
  on pedidos for update
  to authenticated
  using (true)
  with check (true);
