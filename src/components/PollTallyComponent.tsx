import React from "react";

import { Option, Poll, Tally } from "@shared/types";

interface PollTallyComponentProps {
    poll: Poll;
    options: Option[];
    tallies: Tally[];
}

const PollTallyComponent: React.FC<PollTallyComponentProps> = ({
    poll,
    options,
    tallies,
}) => {
    const getTallyForOption = (optionId: number) => {
        const tally = tallies.find((t) => t.option_id === optionId);
        return tally ? tally.responses : 0;
    };

    return (
        <div className="box p-5">
            <div className="content">
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {options.map((option) => (
                        <li key={option.id} className="mb-5">
                            <div className="media">
                                <div className="media-content">
                                    <p className="is-size-5">{option.text}</p>
                                    <progress
                                        className="progress is-primary"
                                        value={getTallyForOption(option.id)}
                                        max={Math.max(
                                            ...tallies.map((t) => t.responses),
                                            1
                                        )}
                                    >
                                        {getTallyForOption(option.id)}
                                    </progress>
                                </div>
                                <div className="media-right">
                                    <span className="tag is-primary is-light">
                                        {getTallyForOption(option.id)} votes
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="has-text-right has-text-grey">
                Poll created on: {new Date(poll.created).toLocaleDateString()}
            </p>
            {poll.ended && (
                <p className="has-text-right has-text-danger">
                    Poll ended on: {new Date(poll.ended).toLocaleDateString()}
                </p>
            )}
        </div>
    );
};

export default PollTallyComponent;
