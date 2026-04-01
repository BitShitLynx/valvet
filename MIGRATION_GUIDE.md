# ValVet — Guía de Migración y Onboarding

Sistema de gestión veterinaria desarrollado por **Lynx**.
Stack: React + TypeScript + Vite + Supabase + Vercel.

---

## Alta de nueva clínica

Ver el script completo en `src/sql/alta_clinica.sql`.

### Pasos resumidos

**1. Crear la clínica en la tabla `clinicas`**

```sql
insert into clinicas (id, nombre, telefono, email)
values (gen_random_uuid(), 'NOMBRE_CLINICA', 'TELEFONO', 'EMAIL');

select id from clinicas where nombre = 'NOMBRE_CLINICA';
```

**2. Crear el usuario admin en Supabase Auth**

- Ir a Supabase Dashboard → Authentication → Users → Add user
- Completar email y contraseña temporal
- Copiar el UUID generado

**3. Vincular usuario a la clínica**

```sql
insert into usuarios (id, clinica_id, nombre, rol, email, activo)
values ('UUID_AUTH', 'UUID_CLINICA', 'Nombre Admin', 'admin', 'email@clinica.com', true);
```

**4. Confirmar email (si no se hizo desde el dashboard)**

```sql
update auth.users
set email_confirmed_at = now()
where email = 'email@clinica.com';
```

**5. Copiar catálogo de productos desde la clínica demo**

```sql
insert into productos (clinica_id, nombre, categoria, especie, dosis, vias, stock_actual, unidad)
select
  'UUID_CLINICA',
  nombre, categoria, especie, dosis, vias,
  0 as stock_actual,
  unidad
from productos
where clinica_id = 'aaaaaaaa-0000-0000-0000-000000000001';
```

---

## Agregar usuarios adicionales a una clínica existente

Desde la interfaz (módulo **Usuarios**, solo admins):

1. Completar nombre, email y rol
2. La app muestra instrucciones paso a paso
3. Crear el usuario en Supabase Auth → copiar UUID
4. Pegar el UUID en el formulario → Vincular

Desde SQL (alternativa):

```sql
-- 1. Crear en Supabase Auth (Dashboard) y copiar UUID
-- 2. Insertar en tabla usuarios
insert into usuarios (id, clinica_id, nombre, rol, email, activo)
values ('UUID_AUTH', 'UUID_CLINICA', 'Nombre', 'veterinario', 'email@clinica.com', true);

-- 3. Confirmar email
update auth.users set email_confirmed_at = now() where email = 'email@clinica.com';
```

---

## Políticas RLS requeridas

Ejecutar en SQL Editor de Supabase antes de usar el módulo Usuarios:

```sql
-- Permitir que admins inserten usuarios en su propia clínica
drop policy if exists "usuarios_insert" on usuarios;

create policy "usuarios_insert" on usuarios
  for insert to authenticated
  with check (
    clinica_id = (
      select clinica_id from usuarios
      where id = auth.uid()
      limit 1
    )
  );
```

Ver el archivo completo en `src/sql/fix_usuarios_rls.sql`.

---

## Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producción
npm run preview   # previsualizar build
```

---

## Despliegue (Vercel)

El proyecto se despliega automáticamente desde `main` vía Vercel.
Variables de entorno configuradas en Vercel Dashboard → Settings → Environment Variables.

---

## Estructura del proyecto

```
src/
├── pages/
│   ├── Login.tsx           # Login + recuperación de contraseña
│   ├── Inicio.tsx          # Dashboard con cards de módulos
│   ├── Turnos.tsx          # Agenda, vista semanal, reprogramar, cobros
│   ├── Pacientes.tsx       # Fichas e historial clínico
│   ├── Propietarios.tsx    # Clientes y contactos
│   ├── Intervenciones.tsx  # Aplicación de drogas
│   ├── Cirugias.tsx        # Registro quirúrgico
│   ├── Recetas.tsx         # Prescripciones veterinarias
│   ├── Inventario.tsx      # Stock e insumos
│   ├── Facturacion.tsx     # Cobros y pagos
│   ├── Gastos.tsx          # Egresos operativos
│   ├── Reportes.tsx        # Métricas y balance
│   ├── Usuarios.tsx        # Gestión de usuarios y roles
│   ├── Ajustes.tsx         # Preferencias personales
│   └── AdminLynx.tsx       # Panel interno Lynx (restringido)
├── components/
│   ├── toast.tsx           # Sistema de notificaciones + ConfirmModal
│   ├── shared.tsx          # Modal, Paginacion y otros componentes reutilizables
│   └── ErrorBoundary.tsx   # Captura de errores React
├── styles/
│   └── theme.ts            # Tema dark/light, makeS(), constantes de estilo
├── sql/
│   ├── alta_clinica.sql    # Script completo de onboarding de clínica
│   └── fix_usuarios_rls.sql # Política RLS para inserción de usuarios
├── App.tsx                 # Shell principal, sidebar, routing por vista
├── main.tsx                # Entry point, ErrorBoundary wrapper
└── supabaseClient.ts       # Cliente Supabase + queryConTimeout + tipos
```

---

## Roles y permisos

| Rol | Acceso |
|-----|--------|
| `admin` | Acceso total. Usuarios, reportes, precios, configuración |
| `veterinario` | Clínico completo. Pacientes, turnos, intervenciones, cirugías, recetas |
| `recepcionista` | Turnos, propietarios, cobros. Sin acceso a finanzas ni usuarios |

---

## localStorage utilizado

| Clave | Descripción |
|-------|-------------|
| `valvet-tema` | `'dark'` \| `'light'` |
| `valvet-vista` | Última sección visitada |
| `valvet-umbral-stock` | Umbral de alerta de stock (default: 5) |
| `valvet-notificaciones` | `'true'` \| `'false'` |
| `valvet-matricula-{userId}` | Matrícula veterinaria del usuario |

## sessionStorage utilizado

| Clave | Descripción |
|-------|-------------|
| `valvet-stock-alertas` | Evita mostrar alertas de stock más de una vez por sesión |
