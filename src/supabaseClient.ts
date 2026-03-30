import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltan variables de entorno de Supabase.\n' +
    'Asegurate de tener un archivo .env con:\n' +
    '  VITE_SUPABASE_URL=...\n' +
    '  VITE_SUPABASE_ANON_KEY=...'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function queryConTimeout<T>(
  promesa: PromiseLike<T>,
  ms = 8000
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('La consulta tardó demasiado. Verificá tu conexión.')), ms)
  );
  return Promise.race([Promise.resolve(promesa), timeout]);
}

export interface Clinica    { id: string; nombre: string; direccion?: string; telefono?: string; email?: string; }
export interface Usuario    { id: string; clinica_id: string; nombre: string; rol: 'admin' | 'veterinario' | 'recepcionista'; email: string; }
export interface Propietario{ id: string; clinica_id: string; nombre: string; telefono?: string; direccion?: string; email?: string; }
export interface Paciente   { id: string; clinica_id: string; propietario_id?: string; nombre: string; especie: string; raza?: string; sexo?: 'Macho' | 'Hembra' | 'No especificado'; edad_años?: number; edad_meses?: number; peso_kg?: number; color?: string; microchip?: string; estado: 'ambulatorio' | 'internado' | 'alta' | 'pendiente'; fecha_registro?: string; propietarios?: Propietario; }
export interface Internacion{ id: string; paciente_id: string; clinica_id: string; motivo?: string; fecha_ingreso: string; fecha_egreso?: string; observaciones?: string; }
export interface Consulta   { id: string; paciente_id: string; clinica_id: string; veterinario_id?: string; fecha: string; motivo?: string; peso_kg?: number; temp_c?: number; evolucion?: string; diagnostico?: string; tratamiento?: string; }
export interface Aplicacion { id: string; consulta_id?: string; paciente_id: string; clinica_id: string; producto_nombre: string; categoria?: string; dosis?: string; via?: string; cantidad?: string; lote?: string; vencimiento?: string; fecha_aplicacion: string; }
