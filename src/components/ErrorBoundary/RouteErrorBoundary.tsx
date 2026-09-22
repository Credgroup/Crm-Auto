import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class RouteErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route Error Boundary capturou um erro:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Chama callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
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
        <div className="min-h-[400px] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-xl border-amber-200 dark:border-amber-800">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-xl font-bold text-amber-800 dark:text-amber-200">
                Problema na Página
              </CardTitle>
              <CardDescription className="text-amber-600 dark:text-amber-400">
                Houve um erro ao carregar esta seção da aplicação.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Informações do erro para desenvolvedores */}
              {import.meta.env.VITE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <Bug className="w-3 h-3" />
                    Detalhes do erro:
                  </div>
                  <div className="text-xs font-mono text-amber-600 dark:text-amber-400 bg-white dark:bg-gray-900 p-2 rounded border overflow-auto max-h-24">
                    {this.state.error.message}
                  </div>
                </div>
              )}

              {/* Ações para o usuário */}
              <div className="flex justify-center">
                <Button 
                  onClick={this.handleReload}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundaryClass; 