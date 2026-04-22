import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "./ui/ErrorState"; // Reutilizamos tu UI

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", maxWidth: 600, margin: "0 auto" }}>
            <ErrorState 
                title="¡Ups! Algo se rompió en la interfaz."
                message="Nuestro equipo ya fue notificado. Intentá recargar la página."
                onRetry={() => window.location.reload()}
            />
        </div>
      );
    }

    return this.props.children;
  }
}