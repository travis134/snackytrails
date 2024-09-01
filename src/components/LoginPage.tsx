import React, { ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Credentials } from "@shared/types";
import { AuthorizationService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import LoginFormSkeletonComponent from "@components/LoginFormSkeletonComponent";
import LoginFormComponent from "@components/LoginFormComponent";

interface LoginPageProps {
    authorizationService: AuthorizationService;
}

const LoginPage: React.FC<LoginPageProps> = ({ authorizationService }) => {
    const queryClient = useQueryClient();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const clearLogin = () => {
        setUsername("");
        setPassword("");
    };

    const {
        data: authorization,
        isPending: isLoading,
        error,
    } = useQuery({
        queryKey: ["authorization"],
        queryFn: () => {
            return authorizationService.authorization();
        },
    });

    const {
        mutate: authorize,
        isPending: authorizeIsPending,
        error: authorizeError,
    } = useMutation({
        mutationFn: async (credentials: Credentials) => {
            await authorizationService.authorize(credentials);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["authorization"],
            });
            clearLogin();
        },
    });

    const onLoginFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        authorize({ username, password });
    };

    let hero: ReactNode;
    let body: ReactNode;

    if (isLoading) {
        hero = <HeroSkeletonComponent />;
        body = <LoginFormSkeletonComponent />;
    } else if (error) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={error as any} />;
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
