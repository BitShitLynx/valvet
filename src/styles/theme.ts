import React from 'react';

export type Tema = 'dark' | 'light';

export const TEMAS = {
  dark: {
    bg:         '#0a1a0f',
    bgSidebar:  '#0d2014',
    bgCard:     '#112918',
    bgInput:    '#0a1a0f',
    border:     '#1e4a2a',
    borderSide: '#163520',
    text:       '#e8f5eb',
    textMuted:  '#6daa7f',
    textLabel:  '#4d8a5f',
    accent:     '#22c55e',
    rowHover:   '#0d2014',
  },
  light: {
    bg:         '#f0faf2',
    bgSidebar:  '#0d2014',
    bgCard:     '#ffffff',
    bgInput:    '#f4fbf5',
    border:     '#bbdfc5',
    borderSide: '#163520',
    text:       '#0a2e14',
    textMuted:  '#3d7a52',
    textLabel:  '#2d6040',
    accent:     '#16a34a',
    rowHover:   '#e8f5eb',
  },
};

export type TemaObj = typeof TEMAS.dark;

export const makeS = (t: TemaObj) => ({
  input:      { background: t.bgInput, color: t.text, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px', width: '100%', boxSizing: 'border-box' } as React.CSSProperties,
  label:      { fontSize: '11px', color: t.textLabel, marginBottom: '4px', display: 'block', textTransform: 'uppercase' as const } as React.CSSProperties,
  card:       { background: t.bgCard, borderRadius: '12px', border: `1px solid ${t.border}`, padding: '20px' } as React.CSSProperties,
  btnPrimary: { padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' } as React.CSSProperties,
  btnSuccess: { padding: '10px 20px', background: '#15803d', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' } as React.CSSProperties,
  btnGhost:   { padding: '10px 20px', background: 'transparent', color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: '8px', cursor: 'pointer' } as React.CSSProperties,
  btnDanger:  { padding: '6px 12px', background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' } as React.CSSProperties,
});

export const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  ambulatorio: { label: 'Ambulatorio', color: '#16a34a' },
  internado:   { label: 'Internado',   color: '#d97706' },
  alta:        { label: 'Alta',        color: '#0891b2' },
  pendiente:   { label: 'Pendiente',   color: '#7c3aed' },
};

export const ESPECIES = ['Canino', 'Felino', 'Equino', 'Bovino', 'Porcino', 'Ave', 'Reptil', 'Otro'];
export const SEXOS    = ['Macho', 'Hembra', 'No especificado'];

export const CATEGORIAS_INV = ['Vacuna', 'Antibiótico', 'Antiparasitario', 'AINE', 'Corticoide', 'Anestésico', 'Sedante', 'Otro'];
export const UNIDADES_INV   = ['dosis', 'comp', 'ml', 'vial', 'ampolla', 'sobre', 'unidad'];

export const COLORES_CAT: Record<string, string> = {
  'Vacuna':          '#15803d',
  'Antibiótico':     '#0891b2',
  'Antiparasitario': '#7c3aed',
  'AINE':            '#d97706',
  'Corticoide':      '#dc2626',
  'Anestésico':      '#0f766e',
  'Sedante':         '#0f766e',
  'Otro':            '#4b5563',
};

export interface Producto {
  id: number; nombre: string; categoria: string; especie: string;
  dosis: string[]; vias: string[]; stock: number; unidad: string;
}

export const CATALOGO_INICIAL: Producto[] = [
  { id: 1,  nombre: 'Vacuna Séxtuple Canina',        categoria: 'Vacuna',          especie: 'Canino',        dosis: ['1 dosis (1ml) cachorro', '1 dosis (1ml) adulto refuerzo anual'], vias: ['SC', 'IM'],           stock: 12, unidad: 'dosis' },
  { id: 2,  nombre: 'Vacuna Antirrábica',            categoria: 'Vacuna',          especie: 'Canino/Felino', dosis: ['1 dosis (1ml)'],                                                  vias: ['SC', 'IM'],           stock: 20, unidad: 'dosis' },
  { id: 3,  nombre: 'Vacuna Tos de las Perreras',    categoria: 'Vacuna',          especie: 'Canino',        dosis: ['1 dosis (1ml)'],                                                  vias: ['SC', 'Intranasal'],   stock: 6,  unidad: 'dosis' },
  { id: 4,  nombre: 'Vacuna Leptospirosis',          categoria: 'Vacuna',          especie: 'Canino',        dosis: ['1 dosis (1ml)'],                                                  vias: ['SC', 'IM'],           stock: 8,  unidad: 'dosis' },
  { id: 5,  nombre: 'Vacuna Triple Felina (HCP)',    categoria: 'Vacuna',          especie: 'Felino',        dosis: ['1 dosis (1ml) cachorro', '1 dosis (1ml) adulto refuerzo anual'], vias: ['SC'],                 stock: 10, unidad: 'dosis' },
  { id: 6,  nombre: 'Vacuna Leucemia Felina (FeLV)', categoria: 'Vacuna',          especie: 'Felino',        dosis: ['1 dosis (1ml)'],                                                  vias: ['SC'],                 stock: 5,  unidad: 'dosis' },
  { id: 7,  nombre: 'Vacuna Aftosa',                 categoria: 'Vacuna',          especie: 'Bovino',        dosis: ['2ml menores 12 meses', '3ml adultos'],                            vias: ['SC', 'IM'],           stock: 30, unidad: 'dosis' },
  { id: 8,  nombre: 'Vacuna Brucelosis (Cepa 19)',   categoria: 'Vacuna',          especie: 'Bovino',        dosis: ['2ml terneras 3-8 meses'],                                         vias: ['SC'],                 stock: 15, unidad: 'dosis' },
  { id: 9,  nombre: 'Vacuna Tétanos Equino',         categoria: 'Vacuna',          especie: 'Equino',        dosis: ['1ml primovacunación', '1ml refuerzo anual'],                      vias: ['IM'],                 stock: 4,  unidad: 'dosis' },
  { id: 10, nombre: 'Amoxicilina 500mg',             categoria: 'Antibiótico',     especie: 'General',       dosis: ['10mg/kg cada 12hs', '20mg/kg cada 12hs (infecciones severas)'],  vias: ['VO', 'SC', 'IM'],     stock: 45, unidad: 'comp'  },
  { id: 11, nombre: 'Enrofloxacina 50mg/ml',         categoria: 'Antibiótico',     especie: 'General',       dosis: ['5mg/kg cada 24hs', '10mg/kg cada 24hs'],                          vias: ['SC', 'IM', 'VO'],     stock: 20, unidad: 'ml'   },
  { id: 12, nombre: 'Cefalexina 250mg',              categoria: 'Antibiótico',     especie: 'Canino/Felino', dosis: ['15mg/kg cada 12hs', '22mg/kg cada 8hs'],                          vias: ['VO'],                 stock: 60, unidad: 'comp'  },
  { id: 13, nombre: 'Penicilina G Benzatínica',      categoria: 'Antibiótico',     especie: 'General',       dosis: ['22.000 UI/kg dosis única', '44.000 UI/kg dosis única'],           vias: ['IM'],                 stock: 10, unidad: 'vial'  },
  { id: 14, nombre: 'Ivermectina 1%',                categoria: 'Antiparasitario', especie: 'General',       dosis: ['0.2mg/kg (200mcg/kg)', '0.4mg/kg sarna demodécica'],              vias: ['SC', 'VO'],           stock: 8,  unidad: 'ml'   },
  { id: 15, nombre: 'Milbemicina Oxima',             categoria: 'Antiparasitario', especie: 'Canino/Felino', dosis: ['0.5mg/kg', '1mg/kg'],                                             vias: ['VO'],                 stock: 24, unidad: 'comp'  },
  { id: 16, nombre: 'Praziquantel 50mg',             categoria: 'Antiparasitario', especie: 'General',       dosis: ['5mg/kg dosis única', '10mg/kg dosis única'],                      vias: ['VO', 'SC'],           stock: 30, unidad: 'comp'  },
  { id: 17, nombre: 'Meloxicam 2mg/ml',              categoria: 'AINE',            especie: 'General',       dosis: ['0.1mg/kg cada 24hs', '0.2mg/kg dosis de carga'],                  vias: ['SC', 'IM', 'IV', 'VO'], stock: 15, unidad: 'ml' },
  { id: 18, nombre: 'Carprofeno 50mg/ml',            categoria: 'AINE',            especie: 'Canino',        dosis: ['4mg/kg dosis única', '2mg/kg cada 12hs'],                         vias: ['SC', 'VO'],           stock: 10, unidad: 'ml'   },
  { id: 19, nombre: 'Dexametasona 4mg/ml',           categoria: 'Corticoide',      especie: 'General',       dosis: ['0.1mg/kg antiinflamatorio', '0.5-1mg/kg shock'],                  vias: ['IM', 'IV', 'SC'],     stock: 12, unidad: 'ml'   },
  { id: 20, nombre: 'Ketamina 50mg/ml',              categoria: 'Anestésico',      especie: 'General',       dosis: ['5-10mg/kg inducción', '2-4mg/kg mantenimiento'],                  vias: ['IM', 'IV'],           stock: 6,  unidad: 'vial'  },
  { id: 21, nombre: 'Xilazina 2%',                   categoria: 'Sedante',         especie: 'General',       dosis: ['1mg/kg perros', '0.5mg/kg gatos', '1.1mg/kg equinos'],            vias: ['IM', 'IV', 'SC'],     stock: 5,  unidad: 'vial'  },
  { id: 22, nombre: 'Acepromazina 1%',               categoria: 'Sedante',         especie: 'General',       dosis: ['0.05mg/kg', '0.1mg/kg'],                                          vias: ['IM', 'SC', 'IV'],     stock: 7,  unidad: 'vial'  },
];

export const formatFecha = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
