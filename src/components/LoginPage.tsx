import React, { useState } from "react";

import { useLoginMutation, useLoginQuery } from "@queries/useLogin";
import { LoginService } from "@types";

import ErrorComponent from "@components/ErrorComponent";

interface LoginPageProps {
    loginService: LoginService;
}

const LoginPage: React.FC<LoginPageProps> = ({ loginService }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {
        data: isLoggedIn,
        isPending: isLoggedInLoading,
        error: isLoggedInError,
    } = useLoginQuery();

    const {
        mutate: loginMutate,
        error: loginMutateError,
        isPending: loginMutateIsPending,
    } = useLoginMutation(loginService);

    const error = isLoggedInError || loginMutateError;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutate({ username, password });
    };

    if (isLoggedInLoading) {
        return (
            <section className="section">
                <div className="container is-max-tablet">
                    <div className="box">
                        <p>Loading...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (isLoggedIn) {
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
                                disabled={loginMutateIsPending}
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
                                disabled={loginMutateIsPending}
                                required
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="notification is-danger">
                            <ErrorComponent error={error} />
                        </div>
                    )}

                    <div className="field is-grouped is-grouped-right">
                        <div className="control">
                            <button
                                className={`button is-primary ${
                                    loginMutateIsPending && "is-loading"
                                }`}
                                type="submit"
                                disabled={loginMutateIsPending}
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
