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
        <div className="columns is-multiline">
            {options.map((option) => (
                <div
                    key={option.id}
                    className="column is-half-tablet is-one-third-desktop"
                >
                    <div className="box is-clickable">
                        {option.image && (
                            <figure className="image is-128x128">
                                <img src={option.image} alt={option.text} />
                            </figure>
                        )}
                        <p>{option.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PollVoteComponent;
