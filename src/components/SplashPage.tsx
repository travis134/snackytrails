import React from "react";

interface SplashPageProps {
    logo: string;
}

const SplashPage: React.FC<SplashPageProps> = ({ logo }) => {
    return (
        <section className="hero is-halfheight">
            <div className="hero-body is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                <img src={logo} alt="Snacky Trails" />
                <p className="mt-5 has-text-dark">Coming Soon!</p>
            </div>
        </section>
    );
};

export default SplashPage;
