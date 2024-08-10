/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { matchPath, useLocation } from "react-router-dom";

import Routes from "@lib/routes";

interface HeaderComponentProps {
    icon: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ icon }) => {
    const { pathname } = useLocation();
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
                    <a className="navbar-item" href={Routes.HomeRoute.href()}>
                        <img
                            src={icon}
                            alt="Snacky Trails"
                            style={{ maxHeight: "50px" }}
                        />
                    </a>
                    <a
                        role="button"
                        className={`navbar-burger  ${isActive && "is-active"}`}
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
                    className={`navbar-menu ${isActive && "is-active"}`}
                >
                    <div className="navbar-start">
                        <a
                            className={`navbar-item ${
                                matchPath(Routes.BlogRoute.path, pathname) &&
                                "is-selected"
                            }`}
                            href={Routes.BlogRoute.href()}
                        >
                            Blog
                        </a>
                        <a
                            className={`navbar-item ${
                                (matchPath(Routes.PollsRoute.path, pathname) ||
                                    matchPath(
                                        Routes.PollRoute.path,
                                        pathname
                                    )) &&
                                "is-selected"
                            }`}
                            href={Routes.PollsRoute.href()}
                        >
                            Polls
                        </a>
                        <a
                            className={`navbar-item ${
                                matchPath(Routes.AboutRoute.path, pathname) &&
                                "is-selected"
                            }`}
                            href={Routes.AboutRoute.href()}
                        >
                            About
                        </a>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <a
                                    className="button is-primary"
                                    href="mailto:info@snackytrails.us"
                                >
                                    Contact us
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
