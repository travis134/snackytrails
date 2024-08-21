import React from "react";

const HeroSkeletonComponent: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-body">
                <p className="title skeleton-lines">
                    <div />
                </p>
                <p className="subtitle skeleton-lines">
                    <div />
                </p>
            </div>
        </section>
    );
};

export default HeroSkeletonComponent;
