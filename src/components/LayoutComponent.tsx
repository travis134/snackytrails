import React, { ReactNode } from "react";

interface LayoutComponentProps {
    header: ReactNode;
    children: ReactNode;
    footer: ReactNode;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({
    header,
    children,
    footer,
}) => {
    return (
        <>
            {header}
            <main className="section has-background-primary-light">
                {children}
            </main>
            {footer}
        </>
    );
};

export default LayoutComponent;
