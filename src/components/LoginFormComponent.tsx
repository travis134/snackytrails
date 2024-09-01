import React from "react";

import ErrorComponent from "@components/ErrorComponent";

interface LoginFormComponentProps {
    onSubmit: (e: React.FormEvent) => void;
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    disabled: boolean;
    error: Error | null;
}

const LoginFormComponent: React.FC<LoginFormComponentProps> = ({
    onSubmit,
    username,
    setUsername,
    password,
    setPassword,
    disabled,
    error,
}) => {
    return (
        <div className="container is-max-tablet">
            <form className="box" onSubmit={onSubmit}>
                <div className="field mb-2">
                    <label className="label">Username</label>
                    <div className="control has-icons-left">
                        <input
                            className="input"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={disabled}
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
                            disabled={disabled}
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
                            className="button is-primary has-text-white is-fullwidth"
                            type="submit"
                            disabled={disabled}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginFormComponent;
