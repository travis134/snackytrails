import React from "react";

interface HeroComponentProps {
    title: string;
    subtitle: string;
}

const HeroComponent: React.FC<HeroComponentProps> = ({ title, subtitle }) => {
    return (
        <section className="hero">
            <div className="hero-body">
                <p className="title">{title}</p>
                <p className="subtitle">{subtitle}</p>
            </div>
        </section>
    );
};

export default HeroComponent;
