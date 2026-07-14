import { Component, type ErrorInfo, type ReactNode } from "react";

type Fallback = ReactNode | ((reset: () => void) => ReactNode);

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: Fallback;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      return typeof fallback === "function" ? fallback(this.reset) : fallback;
    }
    return this.props.children;
  }
}
