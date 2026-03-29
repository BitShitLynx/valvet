import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { Usuario } from './supabaseClient';
import { TEMAS, makeS } from './styles/theme';
import type { Tema } from './styles/theme';

import PantallaLogin         from './pages/Login';
import PantallaInicio        from './pages/Inicio';
import SeccionPacientes      from './pages/Pacientes';
import SeccionPropietarios   from './pages/Propietarios';
import SeccionIntervenciones from './pages/Intervenciones';
import SeccionInventario     from './pages/Inventario';
import SeccionTurnos         from './pages/Turnos';
import SeccionFacturacion    from './pages/Facturacion';
import SeccionRecetas        from './pages/Recetas';
import SeccionCirugias       from './pages/Cirugias';
import SeccionGastos         from './pages/Gastos';
import SeccionReportes       from './pages/Reportes';
import SeccionUsuarios       from './pages/Usuarios';
import { ToastProvider }     from './components/toast';

const LYNX_LOGO = 'data:image/png;base64,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';

const App = () => {
  const [usuario, setUsuario]           = useState<Usuario | null>(null);
  const [vista, setVista]               = useState('inicio');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [temaKey, setTemaKey]           = useState<Tema>('dark');

  const tema = TEMAS[temaKey];
  const S    = makeS(tema);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase.from('usuarios').select('*').eq('id', session.user.id).single();
        if (data) setUsuario(data as Usuario);
      }
      setCheckingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) setUsuario(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => { await supabase.auth.signOut(); setUsuario(null); };

  if (checkingAuth) return (
    <div style={{ minHeight: '100vh', background: TEMAS.dark.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6daa7f' }}>Verificando sesión...</p>
    </div>
  );

  if (!usuario) return <PantallaLogin onLogin={u => { setUsuario(u); setVista('inicio'); }} />;

  const ROL_BADGE: Record<string, string> = { admin: '#15803d', veterinario: '#0891b2', recepcionista: '#7c3aed' };

  const NAV = [
    { key: 'inicio',         label: '🏠 Inicio' },
    { key: 'turnos',         label: '📅 Turnos' },
    { key: 'pacientes',      label: '🐕 Pacientes' },
    { key: 'propietarios',   label: '👤 Propietarios' },
    { key: 'intervenciones', label: '💉 Intervenciones' },
    { key: 'cirugias',       label: '🔪 Cirugías' },
    { key: 'recetas',        label: '📋 Recetas' },
    { key: 'stock',          label: '📦 Inventario' },
    { key: 'facturacion',    label: '💰 Facturación' },
    { key: 'gastos',         label: '📉 Gastos' },
    { key: 'reportes',       label: '📊 Reportes' },
    { key: 'usuarios',       label: '⚙️ Usuarios' },
  ];

  const vistaLabel = NAV.find(n => n.key === vista)?.label?.replace(/^\S+\s/, '') || '';
  const breadcrumb = vista === 'inicio' ? ['Inicio'] : ['Inicio', vistaLabel];

  return (
    <ToastProvider>
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: tema.bg, color: tema.text, fontFamily: 'sans-serif' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '210px', background: tema.bgSidebar, padding: '18px', borderRight: `1px solid ${tema.borderSide}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🩺</span>
          <span style={{ fontSize: '19px', fontWeight: '900', background: 'linear-gradient(135deg,#16a34a,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ValVet</span>
        </div>
        <div style={{ marginBottom: '16px', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.15)', textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 'bold', color: '#e8f5eb', textAlign: 'center' }}>{usuario.nombre}</p>
          <span style={{ fontSize: '10px', background: ROL_BADGE[usuario.rol] || '#15803d', padding: '2px 8px', borderRadius: '99px', color: 'white', fontWeight: 'bold' }}>{usuario.rol}</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, overflowY: 'auto' }}>
          {NAV.map(({ key, label }) => (
            <button key={key} onClick={() => setVista(key)}
              style={{ padding: '9px 11px', border: 'none', borderRadius: '7px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', background: vista === key ? '#16a34a' : 'transparent', color: vista === key ? 'white' : '#6daa7f' }}
              onMouseEnter={e => { if (vista !== key) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,197,94,0.1)'; }}
              onMouseLeave={e => { if (vista !== key) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >{label}</button>
          ))}
        </nav>
        <button onClick={logout} style={{ ...S.btnGhost, width: '100%', marginTop: '12px', fontSize: '12px', borderColor: 'rgba(34,197,94,0.2)', color: '#4d8a5f' }}>
          Cerrar sesión
        </button>
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(34,197,94,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <img src={LYNX_LOGO} alt="Lynx"
            style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'invert(1) brightness(1.1) sepia(1) hue-rotate(80deg) saturate(0.5)', opacity: 0.9 }} />
          <span style={{ fontSize: '9px', color: '#4d8a5f', letterSpacing: '2px', textTransform: 'uppercase' }}>powered by Lynx</span>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', background: tema.bgCard, borderBottom: `1px solid ${tema.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            {breadcrumb.map((b, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {i > 0 && <span style={{ color: tema.textMuted }}>›</span>}
                <span style={{ color: i === breadcrumb.length - 1 ? tema.text : tema.textMuted, cursor: i === 0 && vista !== 'inicio' ? 'pointer' : 'default', fontWeight: i === breadcrumb.length - 1 ? 'bold' : 'normal' }}
                  onClick={() => i === 0 && vista !== 'inicio' && setVista('inicio')}>{b}</span>
              </span>
            ))}
          </div>
          <button onClick={() => setTemaKey(k => k === 'dark' ? 'light' : 'dark')}
            style={{ padding: '7px 14px', background: temaKey === 'dark' ? 'rgba(34,197,94,0.1)' : '#dcfce7', border: `1px solid ${tema.border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: tema.text, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            {temaKey === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro'}
          </button>
        </header>
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {vista === 'inicio'         && <PantallaInicio        usuario={usuario} onNavegar={setVista} tema={tema} />}
          {vista === 'turnos'         && <SeccionTurnos         usuario={usuario} tema={tema} />}
          {vista === 'pacientes'      && <SeccionPacientes      usuario={usuario} tema={tema} />}
          {vista === 'propietarios'   && <SeccionPropietarios   usuario={usuario} tema={tema} />}
          {vista === 'intervenciones' && <SeccionIntervenciones usuario={usuario} tema={tema} />}
          {vista === 'cirugias'       && <SeccionCirugias       usuario={usuario} tema={tema} />}
          {vista === 'recetas'        && <SeccionRecetas        usuario={usuario} tema={tema} />}
          {vista === 'stock'          && <SeccionInventario     usuario={usuario} tema={tema} />}
          {vista === 'facturacion'    && <SeccionFacturacion    usuario={usuario} tema={tema} />}
          {vista === 'gastos'         && <SeccionGastos         usuario={usuario} tema={tema} />}
          {vista === 'reportes'       && <SeccionReportes       usuario={usuario} tema={tema} />}
          {vista === 'usuarios'       && <SeccionUsuarios       usuario={usuario} tema={tema} />}
        </main>
      </div>
    </div>
    </ToastProvider>
  );
};

export default App;
