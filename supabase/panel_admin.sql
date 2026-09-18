-- Ejecutar este script completo en: Supabase -> SQL Editor -> New query
-- (es un script NUEVO, adicional al de pedidos.sql que ya corriste)

-- 1) Permite que el equipo (con sesión iniciada) vea pedidos de CUALQUIER
--    día, no solo los de hoy, para el historial.
create policy "lectura_equipo_historial"
  on pedidos for select
  to authenticated
  using (true);

-- 2) Precios editables por tamaño (o precio único si el producto no tiene
--    tamaños, usando tamano_id = '').
create table if not exists precios_productos (
  producto_id text not null,
  tamano_id text not null default '',
  precio numeric not null,
  actualizado_en timestamptz not null default now(),
  primary key (producto_id, tamano_id)
);

alter table precios_productos enable row level security;

create policy "lectura_publica_precios"
  on precios_productos for select
  to anon, authenticated
  using (true);

create policy "escritura_equipo_precios"
  on precios_productos for all
  to authenticated
  using (true)
  with check (true);

-- 3) Descripciones editables por producto.
create table if not exists descripciones_productos (
  producto_id text primary key,
  descripcion text not null,
  actualizado_en timestamptz not null default now()
);

alter table descripciones_productos enable row level security;

create policy "lectura_publica_descripciones"
  on descripciones_productos for select
  to anon, authenticated
  using (true);

create policy "escritura_equipo_descripciones"
  on descripciones_productos for all
  to authenticated
  using (true)
  with check (true);
