import React, { ReactNode, useState } from "react";

import { AuthorizationService } from "@types";

import {
    useAuthorization,
    useAuthorize,
} from "@lib/queries/AuthorizationQueries";

import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import LoginFormSkeletonComponent from "@components/LoginFormSkeletonComponent";
import LoginFormComponent from "@components/LoginFormComponent";

interface LoginPageProps {
    authorizationService: AuthorizationService;
}

const LoginPage: React.FC<LoginPageProps> = ({ authorizationService }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const clearLogin = () => {
        setUsername("");
        setPassword("");
    };

    const {
        data: authorization,
        isPending: authorizationIsPending,
        error: authorizationError,
    } = useAuthorization({ authorizationService });

    const {
        mutate: authorizeMutation,
        isPending: authorizeIsPending,
        error: authorizeError,
    } = useAuthorize({ authorizationService });
    const authorize = () => {
        const credentials = { username, password };
        authorizeMutation(credentials, {
            onSuccess: () => {
                clearLogin();
            },
        });
    };

    const onLoginFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        authorize();
    };

    let hero: ReactNode;
    let body: ReactNode;

    if (authorizationIsPending) {
        hero = <HeroSkeletonComponent />;
        body = <LoginFormSkeletonComponent />;
    } else if (authorizationError) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={authorizationError as any} />;
    } else {
        hero = (
            <HeroComponent
                title="Login"
                subtitle="For administrators only please"
            />
        );
        if (authorization) {
            body = (
                <div className="container is-max-tablet">
                    <div className="box">
                        <p className="has-text-centered">You are logged in.</p>
                    </div>
                </div>
            );
        } else {
            body = (
                <LoginFormComponent
                    onSubmit={onLoginFormSubmit}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    disabled={authorizeIsPending}
                    error={authorizeError}
                />
            );
        }
    }

    return (
        <>
            {hero}
            <section className="section">{body}</section>
        </>
    );
};

export default LoginPage;
