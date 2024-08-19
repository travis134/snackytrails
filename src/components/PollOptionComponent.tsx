import React from "react";

import { Option, Poll } from "@shared/types";
import Routes from "@lib/routes";

interface PollOptionComponentProps {
    poll: Poll;
    option: Option;
}

const PollOptionComponent: React.FC<PollOptionComponentProps> = ({
    poll,
    option,
}) => {
    return (
        <a
            href={Routes.PollResultsRoute.href({
                id: poll.id,
                optionIds: [option.id.toString(10)],
            })}
        >
            <div className="card">
                {option.image && (
                    <div className="card-image">
                        <figure className="image">
                            <img src={option.image} alt={option.text} />
                        </figure>
                    </div>
                )}
                <div className="card-content">
                    <div className="content">{option.text}</div>
                </div>
                <footer className="card-footer">
                    <p className="card-footer-item has-text-link">Vote</p>
                </footer>
            </div>
        </a>
    );
};

export default PollOptionComponent;
