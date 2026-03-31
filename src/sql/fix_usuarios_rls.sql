-- Permitir que admins inserten usuarios en su propia clínica
drop policy if exists "usuarios_insert" on usuarios;

create policy "usuarios_insert" on usuarios
  for insert to authenticated
  with check (
    -- El clinica_id del nuevo usuario debe coincidir
    -- con el clinica_id del usuario que está insertando
    clinica_id = (
      select clinica_id from usuarios
      where id = auth.uid()
      limit 1
    )
  );
