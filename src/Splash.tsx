import React from "react";
import logo from "./images/logo.svg";

const Splash = () => {
    return (
        <div
            className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
            style={{ height: "100vh" }}
        >
            <img src={logo} alt="Snacky Trails" />
            <p className="mt-4">Coming Soon!</p>
        </div>
    );
};

export default Splash;
