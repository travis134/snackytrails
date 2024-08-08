import React from "react";

const EmptyComponent: React.FC = () => (
    <div className="section">
        <div className="container has-text-centered">
            <div className="notification">
                <p className="title">Sorry, there's nothing to see here</p>
                <p className="subtitle">Try coming back later</p>
            </div>
        </div>
    </div>
);

export default EmptyComponent;
