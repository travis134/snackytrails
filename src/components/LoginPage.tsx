import React, { useState } from "react";

import {
    useAuthorizationMutation,
    useAuthorizationQuery,
} from "@queries/authorization";
import { LoginService, StorageService } from "@types";

import ErrorComponent from "@components/ErrorComponent";

interface LoginPageProps {
    loginService: LoginService;
    storageService: StorageService;
}

const LoginPage: React.FC<LoginPageProps> = ({
    loginService,
    storageService,
}) => {
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
    } = useAuthorizationQuery({ storageService });

    const {
        mutate: authorize,
        isPending: authorizeIsPending,
        error: authorizeError,
    } = useAuthorizationMutation({ loginService, storageService });

    const error = authorizationError || authorizeError;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        authorize({ username, password }, { onSuccess: clearLogin });
    };

    if (authorizationIsPending) {
        return (
            <section className="section">
                <div className="container is-max-tablet">
                    <div className="box">
                        <div className="field mb-2">
                            <label className="label is-skeleton" />
                            <div className="control">
                                <input
                                    className="input is-skeleton"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="field mb-5">
                            <label className="label is-skeleton" />
                            <div className="control">
                                <input
                                    className="input is-skeleton"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <div className="control">
                                <button className="button is-fullwidth is-skeleton" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
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
