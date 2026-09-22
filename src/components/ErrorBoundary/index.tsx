import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary capturou um erro:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl border-red-200 dark:border-red-800">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-800 dark:text-red-200">
                Ops! Algo deu errado
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Encontramos um problema inesperado. Não se preocupe, estamos aqui para ajudar!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Informações do erro para desenvolvedores */}
              {import.meta.env.VITE_ENV !== 'production' && this.state.error && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Bug className="w-4 h-4" />
                    Detalhes do erro:
                  </div>
                  <div className="text-xs font-mono text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 p-3 rounded border overflow-auto max-h-32">
                    <div><strong>Erro:</strong> {this.state.error.message}</div>
                    {this.state.error.stack && (
                      <div className="mt-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ações para o usuário */}
              <div className="flex justify-center">
                <Button 
                  onClick={this.handleReload}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </Button>
              </div>

              {/* Informações adicionais */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Se o problema persistir, entre em contato com o suporte técnico.</p>
                <p>ID do erro: {this.state.error?.name ?? 'ERRO_DESCONHECIDO'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryClass; 