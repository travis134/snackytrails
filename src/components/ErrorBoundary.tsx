import React, { ErrorInfo, ReactNode } from "react";

import ErrorComponent from "@components/ErrorComponent";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    error?: Error;
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error);
        console.error(errorInfo);
    }

    render() {
        const { error } = this.state;
        if (error) {
            return <ErrorComponent error={error} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
