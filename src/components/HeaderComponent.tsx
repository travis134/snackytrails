import React, { useState } from "react";

import { HomeRoute, AboutRoute, PollsRoute } from "@lib/routes";

interface HeaderComponentProps {
    logo: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ logo }) => {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    return (
        <header>
            <nav
                className="navbar"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <a className="navbar-item" href={HomeRoute.href()}>
                        <img
                            src={logo}
                            alt="Snacky Trails"
                            style={{ maxHeight: "50px" }}
                        />
                    </a>
                    <a
                        role="button"
                        className={`navbar-burger  ${
                            isActive ? "is-active" : ""
                        }`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navBarMenu"
                        onClick={toggleMenu}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div
                    id="navBarMenu"
                    className={`navbar-menu ${isActive ? "is-active" : ""}`}
                >
                    <div className="navbar-start">
                        <a className="navbar-item" href={HomeRoute.href()}>
                            Home
                        </a>
                        <a className="navbar-item" href={PollsRoute.href()}>
                            Polls
                        </a>
                        <a className="navbar-item" href={AboutRoute.href()}>
                            About
                        </a>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <a className="button is-primary" href="/signup">
                                    <strong>Sign up</strong>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderComponent;
