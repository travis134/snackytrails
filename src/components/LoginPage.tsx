import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Credentials } from "@shared/types";
import { AuthorizationService } from "@types";

import LoginFormSkeletonComponent from "@components/LoginFormSkeletonComponent";
import ErrorComponent from "@components/ErrorComponent";

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
        isPending: authorizationIsPending,
        error: authorizationError,
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

    const error = authorizationError || authorizeError;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        authorize({ username, password });
    };

    if (authorizationIsPending) {
        return <LoginFormSkeletonComponent />;
    }

    if (authorization) {
        return (
            <section className="section">
                <div className="container is-max-tablet">
                    <div className="box">
                        <p className="has-text-centered">You are logged in.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="container is-max-tablet">
                <form className="box" onSubmit={handleSubmit}>
                    <div className="field mb-2">
                        <label className="label">Username</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={authorizeIsPending}
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-user"></i>
                            </span>
                        </div>
                    </div>

                    <div className="field mb-5">
                        <label className="label">Password</label>
                        <div className="control has-icons-left">
                            <input
                                className="input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={authorizeIsPending}
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    {error && <ErrorComponent error={error} />}

                    <div className="field">
                        <div className="control">
                            <button
                                className={`button is-primary has-text-white is-fullwidth ${
                                    authorizeIsPending && "is-loading"
                                }`}
                                type="submit"
                                disabled={authorizeIsPending}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default LoginPage;
