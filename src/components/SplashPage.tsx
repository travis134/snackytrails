import React from "react";

import logo from "../assets/logo.svg";

const SplashPage = () => {
    return (
        <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
            <img src={logo} alt="Snacky Trails" />
            <p className="mt-4 has-text-dark">Coming Soon!</p>
        </div>
    );
};

export default SplashPage;
