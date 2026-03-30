import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '20px' }}>
          <p style={{ fontSize: '32px' }}>⚠</p>
          <h2 style={{ color: '#d0d0d0', fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Algo salió mal
          </h2>
          <p style={{ color: '#555', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '360px' }}>
            Ocurrió un error inesperado. Recargá la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 24px', background: '#1a2a1a', border: '1px solid #2d5a2d', borderRadius: '6px', color: '#5a9e5a', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.04em', marginTop: '8px' }}>
            Recargar página
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{ fontSize: '11px', color: '#444', maxWidth: '500px', overflow: 'auto', background: '#0f0f0f', padding: '12px', borderRadius: '6px', border: '1px solid #222' }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
