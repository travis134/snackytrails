import React from "react";

import { Option, Poll } from "@shared/types";

interface OptionComponentProps {
    poll: Poll;
    option: Option;
    isSelected: boolean;
    onClick: (option: Option) => Promise<void>;
}

const OptionComponent: React.FC<OptionComponentProps> = ({
    poll,
    option,
    isSelected,
    onClick,
}) => {
    let actionText = "Vote";
    if (poll.selections === "multiple") {
        if (isSelected) {
            actionText = "Selected";
        } else {
            actionText = "Select";
        }
    }

    return (
        <div className="card is-clickable" onClick={() => onClick(option)}>
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
            <footer
                className={`card-footer ${
                    poll.selections === "multiple" &&
                    isSelected &&
                    "has-background-primary-dark"
                }`}
            >
                <p className="card-footer-item has-text-link">{actionText}</p>
            </footer>
        </div>
    );
};

export default OptionComponent;
