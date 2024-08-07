import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

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
            {header}
            <Outlet />
            {footer}
        </>
    );
};

export default LayoutComponent;
