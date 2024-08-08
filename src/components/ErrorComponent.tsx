import React from "react";

import { isAppError } from "@shared/errors";

interface ErrorComponentProps {
    error: Error;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
    let message = "An unknown error occurred";
    let code: string | undefined = undefined;
    if (isAppError(error)) {
        message = error.error;
        code = error.error_code;
    }

    return (
        <div className="section">
            <div className="message is-danger">
                <div className="message-body">
                    <strong>Error:</strong> {message}
                    {code && (
                        <>
                            <br />
                            <strong>Code:</strong> {code}
                        </>
                    )}
                    <p className="has-text-weight-light">
                        Find a nerd to help!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorComponent;
