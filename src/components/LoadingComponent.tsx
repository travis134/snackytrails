import React from "react";

const LoadingComponent: React.FC = () => (
    <div className="has-text-centered">
        <progress className="progress is-small is-primary" max="100">
            Loading...
        </progress>
    </div>
);

export default LoadingComponent;
