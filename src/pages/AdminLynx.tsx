import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { Usuario } from '../supabaseClient';
import { makeS } from '../styles/theme';
import type { TemaObj } from '../styles/theme';
import { useToast } from '../components/toast';

const ADMIN_EMAIL = 'marianonicolasmontano@gmail.com';

interface Clinica {
  id: string; nombre: string; email?: string;
  telefono?: string; created_at: string;
}

const AdminLynx = ({ usuario, tema }: { usuario: Usuario; tema: TemaObj }) => {
  const S = makeS(tema);
  const { toast } = useToast();
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulario 1 — nueva clínica
  const [formClinica, setFormClinica] = useState({ nombre: '', telefono: '', email: '' });
  const [creandoClinica, setCreandoClinica] = useState(false);
  const setC = (k: string, v: string) => setFormClinica(p => ({ ...p, [k]: v }));

  // Formulario 2 — vincular usuario
  const [formUsuario, setFormUsuario] = useState({ clinicaId: '', userId: '', nombre: '', email: '', rol: 'admin' });
  const [vinculando, setVinculando] = useState(false);
  const setU = (k: string, v: string) => setFormUsuario(p => ({ ...p, [k]: v }));

  const cargar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('clinicas').select('*').order('created_at', { ascending: false });
    setClinicas(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crearClinica = async () => {
    if (!formClinica.nombre.trim()) { toast('El nombre de la clínica es obligatorio', 'warning'); return; }
    setCreandoClinica(true);
    const { data: clinica, error } = await supabase
      .from('clinicas').insert({
        nombre: formClinica.nombre.trim(),
        telefono: formClinica.telefono || null,
        email: formClinica.email || null,
      }).select().single();
    if (error || !clinica) { toast('Error al crear la clínica: ' + error?.message, 'error'); setCreandoClinica(false); return; }
    toast(`Clínica "${clinica.nombre}" creada correctamente`, 'success');
    setFormClinica({ nombre: '', telefono: '', email: '' });
    cargar();
    setCreandoClinica(false);
  };

  const vincularUsuario = async () => {
    if (!formUsuario.clinicaId) { toast('Seleccioná una clínica', 'warning'); return; }
    if (!formUsuario.userId.trim()) { toast('El UUID del usuario es obligatorio', 'warning'); return; }
    if (!formUsuario.email.trim()) { toast('El email es obligatorio', 'warning'); return; }
    setVinculando(true);
    const { error } = await supabase.from('usuarios').insert({
      id: formUsuario.userId.trim(),
      clinica_id: formUsuario.clinicaId,
      nombre: formUsuario.nombre.trim() || 'Usuario',
      email: formUsuario.email.trim(),
      rol: formUsuario.rol,
      activo: true,
    });
    if (error) { toast('Error al vincular usuario: ' + error.message, 'error'); setVinculando(false); return; }
    toast('Usuario vinculado correctamente', 'success');
    setFormUsuario({ clinicaId: '', userId: '', nombre: '', email: '', rol: 'admin' });
    setVinculando(false);
  };

  const eliminarClinica = async (id: string, nombre: string) => {
    if (id === 'aaaaaaaa-0000-0000-0000-000000000001') {
      toast('No se puede eliminar la clínica demo', 'warning');
      return;
    }
    const { error } = await supabase.from('clinicas').delete().eq('id', id);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    toast(`Clínica "${nombre}" eliminada`, 'success');
    cargar();
  };

  // Acceso restringido
  if (usuario.email !== ADMIN_EMAIL) {
    return (
      <div style={{ ...S.card, textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: '32px', margin: '0 0 16px' }}>🔒</p>
        <h3 style={{ color: tema.text, margin: '0 0 8px' }}>Acceso restringido</h3>
        <p style={{ color: tema.textMuted, fontSize: '14px' }}>Panel exclusivo de administración Lynx.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ ...S.card, borderLeft: '2px solid #5a9e5a' }}>
        <p style={{ margin: '0 0 4px', fontSize: '11px', color: tema.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Panel interno</p>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: tema.text }}>Administración Lynx</h2>
        <p style={{ margin: '6px 0 0', fontSize: '13px', color: tema.textMuted }}>{clinicas.length} clínica{clinicas.length !== 1 ? 's' : ''} registrada{clinicas.length !== 1 ? 's' : ''}</p>
      </div>

      {/* FORMULARIO 1 — Nueva clínica */}
      <div style={{ ...S.card }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: tema.text }}>Paso 1 — Nueva clínica</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>Nombre de la clínica *</label>
            <input style={S.input} value={formClinica.nombre} onChange={e => setC('nombre', e.target.value)} placeholder="Ej: Veterinaria San Martín" />
          </div>
          <div>
            <label style={S.label}>Teléfono</label>
            <input style={S.input} value={formClinica.telefono} onChange={e => setC('telefono', e.target.value)} placeholder="+54 9 11 1234-5678" />
          </div>
          <div>
            <label style={S.label}>Email de la clínica</label>
            <input style={S.input} value={formClinica.email} onChange={e => setC('email', e.target.value)} placeholder="info@clinica.com" />
          </div>
        </div>
        <button onClick={crearClinica} disabled={creandoClinica}
          style={{ ...S.btnPrimary, marginTop: '20px', padding: '12px 28px', opacity: creandoClinica ? 0.6 : 1 }}>
          {creandoClinica ? 'Creando...' : 'Crear clínica'}
        </button>
      </div>

      {/* FORMULARIO 2 — Vincular usuario */}
      <div style={{ ...S.card }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '600', color: tema.text }}>Paso 2 — Agregar usuario a clínica</h3>

        {/* Instrucciones */}
        <div style={{ background: tema.bgInput, border: `1px solid ${tema.border}`, borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', color: tema.textMuted, lineHeight: '1.7' }}>
          <p style={{ margin: '0 0 8px', fontWeight: '500', color: tema.text }}>Para agregar un nuevo usuario:</p>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Ir a Supabase Dashboard → Authentication → Add user</li>
            <li>Crear el usuario con email y contraseña</li>
            <li>Copiar el UUID generado</li>
            <li>Completar el formulario de abajo y hacer clic en "Vincular usuario"</li>
          </ol>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>Clínica *</label>
            <select style={{ ...S.input, cursor: 'pointer' }} value={formUsuario.clinicaId} onChange={e => setU('clinicaId', e.target.value)}>
              <option value="">-- Seleccionar clínica --</option>
              {clinicas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>UUID del usuario en Auth *</label>
            <input style={S.input} value={formUsuario.userId} onChange={e => setU('userId', e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>Nombre completo</label>
            <input style={S.input} value={formUsuario.nombre} onChange={e => setU('nombre', e.target.value)} placeholder="Ej: Dr. Juan Pérez" />
          </div>
          <div>
            <label style={S.label}>Email *</label>
            <input type="email" style={S.input} value={formUsuario.email} onChange={e => setU('email', e.target.value)} placeholder="usuario@clinica.com" />
          </div>
          <div>
            <label style={S.label}>Rol</label>
            <select style={{ ...S.input, cursor: 'pointer' }} value={formUsuario.rol} onChange={e => setU('rol', e.target.value)}>
              <option value="admin">Admin</option>
              <option value="veterinario">Veterinario</option>
              <option value="recepcionista">Recepcionista</option>
            </select>
          </div>
        </div>
        <button onClick={vincularUsuario} disabled={vinculando}
          style={{ ...S.btnPrimary, marginTop: '20px', padding: '12px 28px', opacity: vinculando ? 0.6 : 1 }}>
          {vinculando ? 'Vinculando...' : 'Vincular usuario'}
        </button>
      </div>

      {/* Lista de clínicas */}
      <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${tema.border}` }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: tema.text }}>Clínicas registradas</h3>
        </div>
        {loading ? (
          <p style={{ padding: '20px', color: tema.textMuted, fontSize: '13px' }}>Cargando...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: tema.bgInput }}>
              <tr>{['Nombre', 'Email', 'Teléfono', 'Creada', 'Acciones'].map(h =>
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: tema.accent, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {clinicas.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '24px', color: tema.textMuted, textAlign: 'center', fontSize: '13px' }}>Sin clínicas registradas.</td></tr>
              )}
              {clinicas.map(c => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${tema.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = tema.rowHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '13px 16px', fontWeight: '600', color: tema.text, fontSize: '14px' }}>{c.nombre}</td>
                  <td style={{ padding: '13px 16px', color: tema.textMuted, fontSize: '13px' }}>{c.email || '—'}</td>
                  <td style={{ padding: '13px 16px', color: tema.textMuted, fontSize: '13px' }}>{c.telefono || '—'}</td>
                  <td style={{ padding: '13px 16px', color: tema.textMuted, fontSize: '13px' }}>
                    {new Date(c.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <button
                      onClick={() => eliminarClinica(c.id, c.nombre)}
                      style={{ padding: '4px 10px', background: 'transparent', color: '#c07070', border: '1px solid #c07070', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminLynx;
