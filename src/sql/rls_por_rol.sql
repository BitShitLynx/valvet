-- =============================================================================
-- RLS POR ROL — ValVet
-- =============================================================================
-- Aplica políticas RESTRICTIVE de rol sobre las políticas PERMISSIVE de
-- clinica_id ya existentes.
--
-- Lógica de combinación en PostgreSQL RLS:
--   · Políticas PERMISSIVE  → se combinan entre sí con OR
--   · Políticas RESTRICTIVE → se combinan con AND contra el resultado anterior
--
-- Resultado: una fila es accesible si pasa la política de clinica_id (existente)
-- Y ADEMÁS el usuario tiene el rol requerido (estas políticas nuevas).
--
-- Convención de nombres: "rol_<tabla>_<operación>"
-- =============================================================================


-- ── FUNCIÓN HELPER ────────────────────────────────────────────────────────────
-- Devuelve el rol del usuario autenticado leyendo la tabla usuarios.
-- SECURITY DEFINER + STABLE para evitar re-evaluación por fila.

CREATE OR REPLACE FUNCTION get_rol_usuario()
RETURNS text AS $$
  SELECT rol FROM usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- =============================================================================
-- GASTOS — solo admin puede todo
-- =============================================================================

DROP POLICY IF EXISTS "rol_gastos_select" ON gastos;
DROP POLICY IF EXISTS "rol_gastos_insert" ON gastos;
DROP POLICY IF EXISTS "rol_gastos_update" ON gastos;
DROP POLICY IF EXISTS "rol_gastos_delete" ON gastos;

CREATE POLICY "rol_gastos_select" ON gastos
  AS RESTRICTIVE FOR SELECT
  USING (get_rol_usuario() = 'admin');

CREATE POLICY "rol_gastos_insert" ON gastos
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() = 'admin');

CREATE POLICY "rol_gastos_update" ON gastos
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() = 'admin');

CREATE POLICY "rol_gastos_delete" ON gastos
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- COBROS — SELECT/INSERT/UPDATE: admin y recepcionista | DELETE: solo admin
-- =============================================================================

DROP POLICY IF EXISTS "rol_cobros_select" ON cobros;
DROP POLICY IF EXISTS "rol_cobros_insert" ON cobros;
DROP POLICY IF EXISTS "rol_cobros_update" ON cobros;
DROP POLICY IF EXISTS "rol_cobros_delete" ON cobros;

CREATE POLICY "rol_cobros_select" ON cobros
  AS RESTRICTIVE FOR SELECT
  USING (get_rol_usuario() IN ('admin', 'recepcionista'));

CREATE POLICY "rol_cobros_insert" ON cobros
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() IN ('admin', 'recepcionista'));

CREATE POLICY "rol_cobros_update" ON cobros
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() IN ('admin', 'recepcionista'));

CREATE POLICY "rol_cobros_delete" ON cobros
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- TIPOS_CONSULTA
--   SELECT : todos los roles (sin política restrictiva → no bloquea)
--   INSERT/UPDATE/DELETE: solo admin
--
-- Nota: RLS no puede restringir UPDATE a nivel de columna (ej. solo "precio").
-- Si se necesita esa granularidad, usar una función RPC con SECURITY DEFINER.
-- =============================================================================

DROP POLICY IF EXISTS "rol_tipos_consulta_insert" ON tipos_consulta;
DROP POLICY IF EXISTS "rol_tipos_consulta_update" ON tipos_consulta;
DROP POLICY IF EXISTS "rol_tipos_consulta_delete" ON tipos_consulta;

-- Sin política restrictiva para SELECT → todos los roles pueden leer.

CREATE POLICY "rol_tipos_consulta_insert" ON tipos_consulta
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() = 'admin');

CREATE POLICY "rol_tipos_consulta_update" ON tipos_consulta
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() = 'admin');

CREATE POLICY "rol_tipos_consulta_delete" ON tipos_consulta
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- USUARIOS
--   SELECT : todos los roles (política existente, no se toca)
--   INSERT/UPDATE/DELETE: solo admin
-- =============================================================================

DROP POLICY IF EXISTS "rol_usuarios_insert" ON usuarios;
DROP POLICY IF EXISTS "rol_usuarios_update" ON usuarios;
DROP POLICY IF EXISTS "rol_usuarios_delete" ON usuarios;

-- Sin política restrictiva para SELECT → todos pueden leer usuarios de su clínica.

CREATE POLICY "rol_usuarios_insert" ON usuarios
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() = 'admin');

CREATE POLICY "rol_usuarios_update" ON usuarios
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() = 'admin');

CREATE POLICY "rol_usuarios_delete" ON usuarios
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- CIRUGIAS — SELECT/INSERT/UPDATE: admin y veterinario | DELETE: solo admin
-- =============================================================================

DROP POLICY IF EXISTS "rol_cirugias_select" ON cirugias;
DROP POLICY IF EXISTS "rol_cirugias_insert" ON cirugias;
DROP POLICY IF EXISTS "rol_cirugias_update" ON cirugias;
DROP POLICY IF EXISTS "rol_cirugias_delete" ON cirugias;

CREATE POLICY "rol_cirugias_select" ON cirugias
  AS RESTRICTIVE FOR SELECT
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_cirugias_insert" ON cirugias
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_cirugias_update" ON cirugias
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_cirugias_delete" ON cirugias
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- CIRUGIA_MEDICAMENTOS — mismas reglas que cirugias
-- (no tiene clinica_id propio; la política de clínica viene por join vía cirugias)
-- =============================================================================

DROP POLICY IF EXISTS "rol_cirugia_medicamentos_select" ON cirugia_medicamentos;
DROP POLICY IF EXISTS "rol_cirugia_medicamentos_insert" ON cirugia_medicamentos;
DROP POLICY IF EXISTS "rol_cirugia_medicamentos_update" ON cirugia_medicamentos;
DROP POLICY IF EXISTS "rol_cirugia_medicamentos_delete" ON cirugia_medicamentos;

CREATE POLICY "rol_cirugia_medicamentos_select" ON cirugia_medicamentos
  AS RESTRICTIVE FOR SELECT
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_cirugia_medicamentos_insert" ON cirugia_medicamentos
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_cirugia_medicamentos_update" ON cirugia_medicamentos
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_cirugia_medicamentos_delete" ON cirugia_medicamentos
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- RECETAS — SELECT/INSERT/UPDATE: admin y veterinario | DELETE: solo admin
-- =============================================================================

DROP POLICY IF EXISTS "rol_recetas_select" ON recetas;
DROP POLICY IF EXISTS "rol_recetas_insert" ON recetas;
DROP POLICY IF EXISTS "rol_recetas_update" ON recetas;
DROP POLICY IF EXISTS "rol_recetas_delete" ON recetas;

CREATE POLICY "rol_recetas_select" ON recetas
  AS RESTRICTIVE FOR SELECT
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_recetas_insert" ON recetas
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_recetas_update" ON recetas
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_recetas_delete" ON recetas
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- RECETA_ITEMS — mismas reglas que recetas
-- (no tiene clinica_id propio; la política de clínica viene por join vía recetas)
-- =============================================================================

DROP POLICY IF EXISTS "rol_receta_items_select" ON receta_items;
DROP POLICY IF EXISTS "rol_receta_items_insert" ON receta_items;
DROP POLICY IF EXISTS "rol_receta_items_update" ON receta_items;
DROP POLICY IF EXISTS "rol_receta_items_delete" ON receta_items;

CREATE POLICY "rol_receta_items_select" ON receta_items
  AS RESTRICTIVE FOR SELECT
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_receta_items_insert" ON receta_items
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_receta_items_update" ON receta_items
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_receta_items_delete" ON receta_items
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');


-- =============================================================================
-- APLICACIONES
--   SELECT/INSERT: admin y veterinario
--   UPDATE/DELETE : solo admin
-- =============================================================================

DROP POLICY IF EXISTS "rol_aplicaciones_select" ON aplicaciones;
DROP POLICY IF EXISTS "rol_aplicaciones_insert" ON aplicaciones;
DROP POLICY IF EXISTS "rol_aplicaciones_update" ON aplicaciones;
DROP POLICY IF EXISTS "rol_aplicaciones_delete" ON aplicaciones;

CREATE POLICY "rol_aplicaciones_select" ON aplicaciones
  AS RESTRICTIVE FOR SELECT
  USING (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_aplicaciones_insert" ON aplicaciones
  AS RESTRICTIVE FOR INSERT
  WITH CHECK (get_rol_usuario() IN ('admin', 'veterinario'));

CREATE POLICY "rol_aplicaciones_update" ON aplicaciones
  AS RESTRICTIVE FOR UPDATE
  USING (get_rol_usuario() = 'admin');

CREATE POLICY "rol_aplicaciones_delete" ON aplicaciones
  AS RESTRICTIVE FOR DELETE
  USING (get_rol_usuario() = 'admin');
