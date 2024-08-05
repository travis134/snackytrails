import React from "react";

import { Option, Poll } from "@shared/types";

interface PollVoteComponentProps {
    poll: Poll;
    options: Option[];
}

const PollVoteComponent: React.FC<PollVoteComponentProps> = ({
    poll,
    options,
}) => {
    return (
        <section className="hero">
            <div className="hero-body">
                <div className="container">
                    <div className="box has-text-centered">
                        <header className="block">
                            <h1 className="title">{poll!.name}</h1>
                            <p className="subtitle">{poll!.description}</p>
                        </header>
                        <div className="block">
                            {poll!.ended && (
                                <p>
                                    <strong>Ended:</strong>{" "}
                                    {new Date(poll!.ended).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        <div className="columns is-multiline">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className="column is-half-tablet is-one-third-desktop"
                                >
                                    <div className="box is-clickable">
                                        {option.image && (
                                            <figure className="image is-128x128">
                                                <img
                                                    src={option.image}
                                                    alt={option.text}
                                                />
                                            </figure>
                                        )}
                                        <p>{option.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PollVoteComponent;
