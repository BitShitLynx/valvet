import React from 'react';
import { makeS, ESTADO_CONFIG } from '../styles/theme';
import type { TemaObj } from '../styles/theme';

export const BadgeEstado = ({ estado }: { estado: string }) => {
  const cfg = ESTADO_CONFIG[estado] || { label: estado, color: '#475569' };
  return (
    <span style={{ fontSize: '11px', background: cfg.color, padding: '3px 10px', borderRadius: '99px', color: 'white', fontWeight: 'bold' }}>
      {cfg.label}
    </span>
  );
};

export const Modal = ({ titulo, onClose, children, tema }: { titulo: string; onClose: () => void; children: React.ReactNode; tema: TemaObj }) => {
  const S = makeS(tema);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ ...S.card, width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #3b82f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#3b82f6' }}>{titulo}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: tema.textMuted, cursor: 'pointer', fontSize: '22px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};
