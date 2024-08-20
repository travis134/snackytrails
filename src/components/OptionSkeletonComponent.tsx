import React from "react";

import p2by1 from "../assets/placeholders/p2by1.svg";

const OptionSkeletonComponent: React.FC = () => {
    return (
        <div className="card">
            <div className="card-image is-2by1">
                <figure className="image is-skeleton">
                    <img alt="Placeholder" src={p2by1} />
                </figure>
            </div>
            <div className="card-content">
                <div className="content skeleton-lines">
                    {Array(2).fill(<div />)}
                </div>
            </div>
            <footer className="card-footer">
                <p className="card-footer-item skeleton-lines">
                    <div />
                </p>
            </footer>
        </div>
    );
};

export default OptionSkeletonComponent;
