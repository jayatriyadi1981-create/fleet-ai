import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Fleet Intelligence UI:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xl shadow-rose-950/20 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Terjadi Kesalahan Aplikasi</h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Sistem mendeteksi kendala runtime pada antarmuka. Anda dapat menyegarkan halaman atau kembali ke dashboard utama.
          </p>
          {this.state.error && (
            <div className="mt-4 max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-3 text-left font-mono text-xs text-rose-300 overflow-x-auto">
              {this.state.error.message}
            </div>
          )}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Muat Ulang Halaman</span>
            </button>
            <a
              href="/app/dashboard"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4 text-cyan-400" />
              <span>Kembali ke Dashboard</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
