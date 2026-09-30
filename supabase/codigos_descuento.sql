-- Ejecutar este script completo en: Supabase -> SQL Editor -> New query
-- (script NUEVO; correr DESPUÉS de ubicacion.sql, aunque también funciona solo)

-- 1) Tabla de códigos de descuento
create table if not exists codigos_descuento (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  porcentaje int not null check (porcentaje between 1 and 100),
  aplica_sobre text not null check (aplica_sobre in ('producto', 'total')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- No puede haber dos códigos iguales (sin importar mayúsculas)
create unique index if not exists codigos_descuento_codigo_idx
  on codigos_descuento (upper(codigo));

alter table codigos_descuento enable row level security;

-- Solo el equipo (con sesión iniciada) puede ver, crear, editar y borrar.
drop policy if exists "equipo_administra_codigos" on codigos_descuento;
create policy "equipo_administra_codigos"
  on codigos_descuento for all
  to authenticated
  using (true)
  with check (true);

-- 2) El público NO puede listar los códigos; solo probar uno.
create or replace function validar_codigo(p_codigo text)
returns table (codigo text, porcentaje int, aplica_sobre text)
language sql
security definer
set search_path = public
as $$
  select c.codigo, c.porcentaje, c.aplica_sobre
  from codigos_descuento c
  where upper(c.codigo) = upper(trim(p_codigo))
    and c.activo
  limit 1;
$$;

grant execute on function validar_codigo(text) to anon, authenticated;

-- 3) Los pedidos guardan qué código se usó y cuánto descontó
alter table pedidos add column if not exists ubicacion_url text;
alter table pedidos add column if not exists codigo_descuento text;
alter table pedidos add column if not exists descuento_codigo numeric;

drop function if exists crear_pedido(text, jsonb, text, numeric);
drop function if exists crear_pedido(text, jsonb, text, numeric, text);

create or replace function crear_pedido(
  p_nombre text,
  p_items jsonb,
  p_zona text,
  p_total numeric,
  p_ubicacion_url text default null,
  p_codigo_descuento text default null,
  p_descuento_codigo numeric default null
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
    numero_pedido, fecha, nombre_cliente, items, zona_entrega, total,
    ubicacion_url, codigo_descuento, descuento_codigo
  )
  values (
    v_siguiente, v_fecha, p_nombre, p_items, p_zona, p_total,
    p_ubicacion_url, p_codigo_descuento, p_descuento_codigo
  )
  returning * into v_pedido;

  return v_pedido;
end;
$$;
