-- Ejecutar este script completo en: Supabase -> SQL Editor -> New query
-- (script NUEVO, adicional a los anteriores)

-- 1) El equipo (con sesión iniciada en /admin) puede ELIMINAR pedidos
--    cancelados o que no respondieron. Al borrarse ya no cuentan en el
--    total del día.
drop policy if exists "eliminar_pedidos_equipo" on pedidos;
create policy "eliminar_pedidos_equipo"
  on pedidos for delete
  to authenticated
  using (true);

-- 2) Contraseña de la vista del local (/local).
--    Se guarda cifrada y NADIE puede leerla desde la página; solo se puede
--    comprobar si una contraseña es correcta.
create extension if not exists pgcrypto with schema extensions;

create table if not exists clave_local (
  id int primary key default 1 check (id = 1),
  hash text not null
);

alter table clave_local enable row level security;
-- (sin políticas = nadie la puede leer ni modificar desde la página)

-- 👇👇 CAMBIA 'charolas2026' POR TU CONTRASEÑA 👇👇
insert into clave_local (id, hash)
values (1, extensions.crypt('charolas2026', extensions.gen_salt('bf')))
on conflict (id) do update set hash = excluded.hash;

create or replace function verificar_clave_local(p_clave text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from clave_local
    where hash = extensions.crypt(p_clave, hash)
  );
$$;

grant execute on function verificar_clave_local(text) to anon, authenticated;

-- Para CAMBIAR la contraseña después, corre solo esto con la nueva:
-- update clave_local set hash = extensions.crypt('NUEVA', extensions.gen_salt('bf')) where id = 1;
