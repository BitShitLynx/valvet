import { useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Usuario } from '../supabaseClient';
import { TEMAS, makeS } from '../styles/theme';

const PantallaLogin = ({ onLogin }: { onLogin: (u: Usuario) => void }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const S = makeS(TEMAS.dark);

  const handleLogin = async () => {
    setError(''); setLoading(true);
    const { data, error: ae } = await supabase.auth.signInWithPassword({ email, password });
    if (ae || !data.user) { setError('Email o contraseña incorrectos.'); setLoading(false); return; }
    const { data: u } = await supabase.from('usuarios').select('*').eq('id', data.user.id).single();
    if (!u) { setError('Usuario no encontrado en el sistema.'); setLoading(false); return; }
    onLogin(u as Usuario);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: TEMAS.dark.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...S.card, width: '400px', border: '1px solid #1e40af' }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '30px' }}>🐾</span>
          <span style={{ fontSize: '26px', fontWeight: '900', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginLeft: '8px' }}>ValVet</span>
        </div>
        <p style={{ color: TEMAS.dark.textMuted, textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>Sistema de Gestión Veterinaria</p>
        {error && <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: '8px', padding: '10px', color: '#f87171', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
        <div style={{ marginBottom: '15px' }}>
          <label style={S.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={S.input} placeholder="veterinario@clinica.com" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={S.label}>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={S.input} placeholder="••••••••" />
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ ...S.btnPrimary, width: '100%', padding: '14px', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Ingresando...' : 'INGRESAR'}
        </button>
      </div>
    </div>
  );
};

export default PantallaLogin;
