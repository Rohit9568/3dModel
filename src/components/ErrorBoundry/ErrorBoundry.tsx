import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorPage } from "../../pages/ErrorPage/ErrorPage";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Mixpanel.track("Error_Occurred", {
      error: error,
      errorInfo: errorInfo,
    });
    console.log(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
