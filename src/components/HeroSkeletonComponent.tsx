import React from "react";

const HeroSkeletonComponent: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-body">
                <div className="title skeleton-lines mb-3">
                    <div />
                </div>
                <div className="subtitle skeleton-lines mb-2">
                    <div />
                </div>
            </div>
        </section>
    );
};

export default HeroSkeletonComponent;
