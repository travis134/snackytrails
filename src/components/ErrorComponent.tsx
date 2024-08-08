import { isAppError } from "@shared/errors";
import React from "react";

interface ErrorComponentProps {
    error: Error;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
    if (!isAppError(error)) {
        return (
            <div className="message is-danger">
                <p>An unknown error occurred</p>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="message is-danger">
                <div className="message-body">
                    <strong>Error:</strong> {error.error}
                    <br />
                    <strong>Code:</strong> {error.error_code}
                    <p className="has-text-weight-light">
                        Find a nerd to help!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorComponent;
