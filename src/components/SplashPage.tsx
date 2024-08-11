import React from "react";

interface SplashPageProps {
    logo: string;
}

const SplashPage: React.FC<SplashPageProps> = ({ logo }) => {
    return (
        <section className="section m-5">
            <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                <img src={logo} alt="Snacky Trails" />
                <p className="mt-5 has-text-dark">Coming Soon!</p>
            </div>
        </section>
    );
};

export default SplashPage;
