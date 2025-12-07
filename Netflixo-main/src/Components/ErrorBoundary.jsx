import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-main flex-colo text-white p-4">
                    <div className="max-w-lg w-full bg-dry p-8 rounded-lg border border-border text-center">
                        <h1 className="text-3xl font-bold mb-4 text-subMain">Oops! Something went wrong.</h1>
                        <p className="text-text mb-6">
                            We're sorry for the inconvenience. Please try refreshing the page or come back later.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-subMain text-white py-3 px-6 rounded font-medium hover:bg-main transitions"
                            >
                                Refresh Page
                            </button>
                            <Link
                                to="/"
                                className="bg-dryGray text-white py-3 px-6 rounded font-medium hover:bg-subMain transitions border border-border"
                            >
                                Go Home
                            </Link>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left bg-main p-4 rounded overflow-auto max-h-64 text-xs text-red-400">
                                <p className="font-bold mb-2">{this.state.error.toString()}</p>
                                <pre>{this.state.errorInfo.componentStack}</pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
