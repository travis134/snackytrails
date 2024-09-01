import React from "react";

const LoginFormSkeletonComponent: React.FC = () => {
    return (
        <div className="container is-max-tablet">
            <div className="box">
                <div className="field mb-2">
                    <div className="title skeleton-lines mb-2">
                        <div />
                    </div>
                    <div className="control">
                        <input className="input is-skeleton" type="text" />
                    </div>
                </div>

                <div className="field mb-5">
                    <div className="title skeleton-lines mb-2">
                        <div />
                    </div>
                    <div className="control">
                        <input className="input is-skeleton" type="text" />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button className="button is-fullwidth is-skeleton">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginFormSkeletonComponent;
