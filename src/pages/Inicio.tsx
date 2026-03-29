import type { Usuario } from '../supabaseClient';
import { makeS } from '../styles/theme';
import type { TemaObj } from '../styles/theme';

const PantallaInicio = ({ usuario, onNavegar, tema }: { usuario: Usuario; onNavegar: (v: string) => void; tema: TemaObj }) => {
  const S = makeS(tema);
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  const modulos = [
    { key: 'turnos',         icon: '📅', label: 'Turnos',         desc: 'Agenda del día, guardias y estados',         color: '#0891b2' },
    { key: 'pacientes',      icon: '🐕', label: 'Pacientes',      desc: 'Fichas, historial clínico e internaciones',   color: '#22c55e' },
    { key: 'propietarios',   icon: '👤', label: 'Propietarios',   desc: 'Clientes, contactos y cobros',                color: '#22c55e' },
    { key: 'intervenciones', icon: '💉', label: 'Intervenciones', desc: 'Aplicar drogas y vacunas desde el stock',     color: '#22c55e' },
    { key: 'cirugias',       icon: '🔪', label: 'Cirugías',       desc: 'Registro y seguimiento quirúrgico',           color: '#d97706' },
    { key: 'recetas',        icon: '📋', label: 'Recetas',        desc: 'Prescripciones e impresión',                  color: '#22c55e' },
    { key: 'stock',          icon: '📦', label: 'Inventario',     desc: 'Stock de drogas, vacunas e insumos',          color: '#22c55e' },
    { key: 'facturacion',    icon: '💰', label: 'Facturación',    desc: 'Cobros y medios de pago',                     color: '#15803d' },
    { key: 'gastos',         icon: '📉', label: 'Gastos',         desc: 'Registro de egresos por categoría',           color: '#f87171' },
    { key: 'reportes',       icon: '📊', label: 'Reportes',       desc: 'Balance, métricas y alertas de stock',        color: '#a78bfa' },
    { key: 'usuarios',       icon: '⚙️', label: 'Usuarios',       desc: 'Gestión de accesos y roles',                  color: '#6daa7f' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Banner */}
      <div style={{ ...S.card, background: 'linear-gradient(135deg,#0a2e14,#112918)', border: '1px solid #1e4a2a', textAlign: 'center', padding: '32px 24px' }}>
        <span style={{ fontSize: '44px', display: 'block', marginBottom: '12px' }}>🩺</span>
        <h2 style={{ margin: '0 0 8px', color: '#e8f5eb', fontSize: '24px', textAlign: 'center' }}>
          {saludo}, {usuario.nombre}
        </h2>
        <p style={{ margin: 0, color: '#6daa7f', fontSize: '14px', textAlign: 'center' }}>
          <strong style={{ color: '#22c55e' }}>ValVet</strong> —{' '}
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Grilla de módulos */}
      <div>
        <h3 style={{ margin: '0 0 16px', color: tema.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center' }}>
          Módulos disponibles
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {modulos.map(m => (
            <div key={m.key} onClick={() => onNavegar(m.key)}
              style={{ ...S.card, cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s', textAlign: 'center', padding: '18px 14px' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = m.color;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = tema.border;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{m.icon}</div>
              <h4 style={{ margin: '0 0 6px', color: tema.text, fontSize: '14px', textAlign: 'center' }}>{m.label}</h4>
              <p style={{ margin: 0, color: tema.textMuted, fontSize: '12px', lineHeight: '1.4', textAlign: 'center' }}>{m.desc}</p>
              <p style={{ margin: '10px 0 0', color: m.color, fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>Abrir →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PantallaInicio;
