import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Usuario } from '../supabaseClient';
import { makeS, ESTADO_CONFIG, CATEGORIAS_INV, COLORES_CAT } from '../styles/theme';
import type { TemaObj } from '../styles/theme';

interface Producto {
  id: string; nombre: string; categoria: string; especie: string;
  dosis: string[]; vias: string[]; stock: number; unidad: string;
}

const mapProducto = (p: any): Producto => ({
  id:        p.id,
  nombre:    p.nombre,
  categoria: p.categoria   || 'Otro',
  especie:   p.especie     || 'General',
  dosis:     Array.isArray(p.dosis) ? p.dosis : [],
  vias:      Array.isArray(p.vias)  ? p.vias  : [],
  stock:     Number(p.stock_actual ?? p.stock ?? 0),
  unidad:    p.unidad      || 'unidad',
});

const SeccionIntervenciones = ({ usuario, tema }: { usuario: Usuario; tema: TemaObj }) => {
  const S = makeS(tema);
  const [catalogo, setCatalogo] = useState<Producto[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteId, setPacienteId] = useState('');
  const [busquedaDroga, setBusquedaDroga] = useState('');
  const [mostrarSug, setMostrarSug] = useState(false);
  const [productoSel, setProductoSel] = useState<Producto | null>(null);
  const [fueraDeStock, setFueraDeStock] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ dosis: '', via: '', cantidad: '', fecha: new Date().toISOString().split('T')[0], lote: '', vencimiento: '', productoManual: '', categoriaManual: 'Vacuna', observaciones: '' });

  useEffect(() => {
    supabase.from('pacientes').select('id,nombre,especie,raza,estado').eq('clinica_id', usuario.clinica_id).order('nombre')
      .then(({ data }) => setPacientes(data || []));
    supabase.from('productos').select('id,nombre,categoria,especie,dosis,vias,stock_actual,unidad')
      .eq('clinica_id', usuario.clinica_id).order('nombre')
      .then(({ data }) => setCatalogo((data || []).map(mapProducto)));
  }, [usuario.clinica_id]);

  const filtrados = catalogo.filter(p => p.nombre.toLowerCase().includes(busquedaDroga.toLowerCase()) || p.categoria.toLowerCase().includes(busquedaDroga.toLowerCase()));
  const seleccionar = (p: Producto) => { setProductoSel(p); setBusquedaDroga(p.nombre); setMostrarSug(false); setFueraDeStock(false); setForm(f => ({ ...f, dosis: '', via: '' })); };
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const confirmar = async () => {
    if (!pacienteId) { setError('Seleccioná un paciente.'); return; }
    if (!fueraDeStock && !productoSel) { setError('Seleccioná un producto del stock.'); return; }
    if (fueraDeStock && !form.productoManual.trim()) { setError('Ingresá el nombre del producto usado.'); return; }
    setSaving(true); setError('');
    const nombreProducto = fueraDeStock ? form.productoManual.trim() : productoSel!.nombre;
    const categoria = fueraDeStock ? form.categoriaManual : productoSel!.categoria;
    const { error: dbErr } = await supabase.from('aplicaciones').insert({
      paciente_id: pacienteId, clinica_id: usuario.clinica_id, producto_nombre: nombreProducto, categoria,
      dosis: form.dosis || null, via: form.via || null, cantidad: form.cantidad || null,
      lote: form.lote || null, vencimiento: form.vencimiento || null, fecha_aplicacion: form.fecha,
    });
    if (dbErr) { setError('Error al guardar: ' + dbErr.message); setSaving(false); return; }
    if (!fueraDeStock && productoSel) {
      const cant = parseFloat(form.cantidad) || 1;
      const nuevoStock = Math.max(0, productoSel.stock - cant);
      await supabase.from('productos').update({ stock_actual: nuevoStock }).eq('id', productoSel.id);
      setCatalogo(prev => prev.map(p => p.id === productoSel.id ? { ...p, stock: nuevoStock } : p));
    }
    setExito(`✅ Intervención registrada: ${nombreProducto} aplicada correctamente.`);
    setPacienteId(''); setProductoSel(null); setBusquedaDroga(''); setFueraDeStock(false);
    setForm({ dosis: '', via: '', cantidad: '', fecha: new Date().toISOString().split('T')[0], lote: '', vencimiento: '', productoManual: '', categoriaManual: 'Vacuna', observaciones: '' });
    setSaving(false);
    setTimeout(() => setExito(''), 4000);
  };

  const badgeStock = (stock: number, unidad: string) => {
    const color = stock === 0 ? '#dc2626' : stock <= 5 ? '#d97706' : '#059669';
    return <span style={{ fontSize: '11px', background: color, padding: '2px 8px', borderRadius: '99px', color: 'white', fontWeight: 'bold' }}>{stock} {unidad}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ ...S.card, border: '1px solid #7c3aed' }}>
        <h3 style={{ margin: '0 0 4px', color: '#a78bfa' }}>💉 Nueva Intervención</h3>
        <p style={{ margin: '0 0 20px', color: tema.textMuted, fontSize: '13px' }}>Aplicá un medicamento o vacuna a un paciente y descontá del stock automáticamente.</p>
        {exito && <div style={{ background: '#052e16', border: '1px solid #059669', borderRadius: '8px', padding: '12px', color: '#34d399', marginBottom: '15px', fontSize: '14px' }}>{exito}</div>}
        {error && <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: '8px', padding: '10px', color: '#f87171', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>Paciente *</label>
            <select value={pacienteId} onChange={e => setPacienteId(e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
              <option value="">-- Seleccionar paciente --</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.especie}{p.raza ? ` · ${p.raza}` : ''}) — {ESTADO_CONFIG[p.estado]?.label || p.estado}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px' }}>
            <button onClick={() => { setFueraDeStock(false); setProductoSel(null); setBusquedaDroga(''); }} style={{ ...fueraDeStock ? S.btnGhost : S.btnPrimary, flex: 1, fontSize: '13px' }}>📦 Desde stock</button>
            <button onClick={() => { setFueraDeStock(true); setProductoSel(null); setBusquedaDroga(''); }} style={{ ...fueraDeStock ? S.btnPrimary : S.btnGhost, flex: 1, fontSize: '13px' }}>✏️ No está en stock</button>
          </div>
          {!fueraDeStock && (
            <div style={{ gridColumn: '1/-1', position: 'relative' }}>
              <label style={S.label}>Producto del stock *</label>
              <input type="text" placeholder="Buscar droga o vacuna..." value={busquedaDroga}
                onChange={e => { setBusquedaDroga(e.target.value); setMostrarSug(true); setProductoSel(null); }}
                onFocus={() => setMostrarSug(true)} onBlur={() => setTimeout(() => setMostrarSug(false), 150)}
                style={{ ...S.input, padding: '12px' }} />
              {productoSel && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: tema.bgInput, borderRadius: '8px', border: `1px solid ${tema.border}` }}>
                  <span style={{ fontWeight: 'bold', color: tema.text }}>{productoSel.nombre}</span>
                  <span style={{ fontSize: '11px', background: COLORES_CAT[productoSel.categoria] || '#475569', padding: '2px 8px', borderRadius: '99px', color: 'white' }}>{productoSel.categoria}</span>
                  {badgeStock(productoSel.stock, productoSel.unidad)}
                  {productoSel.stock === 0 && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠️ Sin stock</span>}
                </div>
              )}
              {mostrarSug && busquedaDroga.length > 0 && !productoSel && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: tema.bgCard, border: '1px solid #3b82f6', borderRadius: '8px', marginTop: '4px', maxHeight: '220px', overflowY: 'auto' }}>
                  {filtrados.length === 0 ? (
                    <div style={{ padding: '12px', color: tema.textMuted, fontSize: '13px' }}>Sin resultados. Usá "No está en stock" para registrar igual.</div>
                  ) : filtrados.map(p => (
                    <div key={p.id} onMouseDown={() => seleccionar(p)}
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: `1px solid ${tema.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = tema.rowHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ color: tema.text }}>{p.nombre}</span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {badgeStock(p.stock, p.unidad)}
                        <span style={{ fontSize: '11px', background: COLORES_CAT[p.categoria] || '#475569', padding: '2px 8px', borderRadius: '99px', color: 'white' }}>{p.categoria}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {fueraDeStock && (
            <>
              <div style={{ gridColumn: '1/-1' }}><label style={S.label}>Nombre del producto usado *</label><input type="text" placeholder="Ej: Doxiciclina 100mg" value={form.productoManual} onChange={e => set('productoManual', e.target.value)} style={S.input} /></div>
              <div><label style={S.label}>Categoría</label><select value={form.categoriaManual} onChange={e => set('categoriaManual', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>{CATEGORIAS_INV.map(c => <option key={c}>{c}</option>)}</select></div>
            </>
          )}
          <div>
            <label style={S.label}>Dosis</label>
            {!fueraDeStock && productoSel?.dosis.length ? (
              <select value={form.dosis} onChange={e => set('dosis', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}><option value="">-- Seleccionar --</option>{productoSel.dosis.map((d, i) => <option key={i} value={d}>{d}</option>)}</select>
            ) : (<input type="text" placeholder="Ej: 10mg/kg" value={form.dosis} onChange={e => set('dosis', e.target.value)} style={S.input} />)}
          </div>
          <div>
            <label style={S.label}>Vía de administración</label>
            {!fueraDeStock && productoSel?.vias.length ? (
              <select value={form.via} onChange={e => set('via', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}><option value="">-- Seleccionar --</option>{productoSel.vias.map((v, i) => <option key={i} value={v}>{v}</option>)}</select>
            ) : (<input type="text" placeholder="Ej: SC, IM, VO" value={form.via} onChange={e => set('via', e.target.value)} style={S.input} />)}
          </div>
          <div><label style={S.label}>Cantidad{productoSel ? ` (${productoSel.unidad})` : ''}</label><input type="number" min="0" step="0.1" placeholder="Ej: 1" value={form.cantidad} onChange={e => set('cantidad', e.target.value)} style={S.input} /></div>
          <div><label style={S.label}>Fecha de aplicación</label><input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} style={{ ...S.input, colorScheme: 'dark' }} /></div>
          <div><label style={S.label}>Lote</label><input type="text" placeholder="Nº de lote" value={form.lote} onChange={e => set('lote', e.target.value)} style={S.input} /></div>
          <div><label style={S.label}>Vencimiento del producto</label><input type="date" value={form.vencimiento} onChange={e => set('vencimiento', e.target.value)} style={{ ...S.input, colorScheme: 'dark' }} /></div>
          <div style={{ gridColumn: '1/-1' }}><label style={S.label}>Observaciones adicionales</label><textarea rows={2} placeholder="Reacción del paciente, notas del veterinario..." value={form.observaciones} onChange={e => set('observaciones', e.target.value)} style={{ ...S.input, resize: 'vertical' }} /></div>
        </div>
        <button onClick={confirmar} disabled={saving} style={{ ...S.btnPrimary, width: '100%', padding: '14px', marginTop: '20px', fontSize: '15px', opacity: saving ? 0.6 : 1 }}>{saving ? 'Registrando...' : '💉 CONFIRMAR INTERVENCIÓN'}</button>
      </div>
    </div>
  );
};

export default SeccionIntervenciones;
