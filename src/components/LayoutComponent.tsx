import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

interface LayoutComponentProps {
    header: ReactNode;
    footer: ReactNode;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({
    header,
    footer,
}) => {
    return (
        <>
            <div id="background" />
            {header}
            <ErrorBoundary>
                <div className="container p-5">
                    <Outlet />
                </div>
            </ErrorBoundary>
            {footer}
        </>
    );
};

export default LayoutComponent;
