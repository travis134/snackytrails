/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { matchPath, useLocation } from "react-router-dom";

import Routes from "@lib/routes";
import { AuthorizationService } from "@types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface HeaderComponentProps {
    icon: string;
    authorizationService: AuthorizationService;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    icon,
    authorizationService,
}) => {
    const queryClient = useQueryClient();
    const { pathname } = useLocation();
    const [isActive, setIsActive] = useState(false);

    const { data: authorization } = useQuery({
        queryKey: ["authorization"],
        queryFn: () => {
            return authorizationService.authorization();
        },
    });

    const { mutate: unauthorize } = useMutation({
        mutationFn: async () => {
            authorizationService.unauthorize();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["authorization"],
            });
        },
    });

    const logOut = () => {
        unauthorize();
    };

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    return (
        <header>
            <nav
                className="navbar is-fixed-top is-white"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <a className="navbar-item" href={Routes.HomeRoute.href()}>
                        <img src={icon} alt="Snacky Trails" />
                        <p className="has-text-weight-bold has-text-primary">
                            Snacky Trails
                        </p>
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
                                matchPath(Routes.BlogsRoute.path, pathname) &&
                                "is-selected"
                            }`}
                            href={Routes.BlogsRoute.href()}
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
                        {authorization && (
                            <div className="navbar-item">
                                <button
                                    className="button is-danger"
                                    onClick={logOut}
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                        <div className="navbar-item">
                            <a
                                className="button is-primary has-text-white"
                                href="mailto:info@snackytrails.us"
                            >
                                <span className="icon">
                                    <i className="fas fa-envelope"></i>
                                </span>
                                <span>Contact Us</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderComponent;
