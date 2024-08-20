import React from "react";

const PollSkeletonComponent: React.FC = () => {
    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title skeleton-lines">
                    <div />
                </p>
            </header>
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

export default PollSkeletonComponent;
