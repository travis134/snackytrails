import React from "react";

const PollSkeletonComponent: React.FC = () => {
    return (
        <div className="card">
            <header className="card-header">
                <div className="card-header-title skeleton-lines">
                    <div />
                </div>
            </header>
            <div className="card-content">
                <div className="content skeleton-lines">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} />
                    ))}
                </div>
            </div>
            <footer className="card-footer">
                <div className="card-footer-item skeleton-lines">
                    <div />
                </div>
            </footer>
        </div>
    );
};

export default PollSkeletonComponent;
