-- Ejecutar este script completo en: Supabase -> SQL Editor -> New query
-- (script NUEVO, adicional a los anteriores)

-- Lista de compras del local (solo el equipo con sesión en /admin).
create table if not exists lista_compras (
  id uuid primary key default gen_random_uuid(),
  producto text not null,
  cantidad text,
  comprado boolean not null default false,
  agregado_por text,
  created_at timestamptz not null default now()
);

alter table lista_compras enable row level security;

drop policy if exists "equipo_lista_compras" on lista_compras;
create policy "equipo_lista_compras"
  on lista_compras for all
  to authenticated
  using (true)
  with check (true);

-- Para que la lista se actualice sola en todos los celulares del equipo.
do $$
begin
  alter publication supabase_realtime add table lista_compras;
exception when duplicate_object then null;
end $$;
