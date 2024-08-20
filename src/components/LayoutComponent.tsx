import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import ErrorBoundary from "@components/ErrorBoundary";

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
                <Outlet />
            </ErrorBoundary>
            {footer}
        </>
    );
};

export default LayoutComponent;
