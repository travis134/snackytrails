import React from "react";

import { Option } from "@shared/types";

interface OptionComponentProps {
    option: Option;
    isSelected: boolean;
    onClick: (option: Option) => void;
}

const OptionComponent: React.FC<OptionComponentProps> = ({
    option,
    isSelected,
    onClick,
}) => {
    let actionText = "Select";
    if (isSelected) {
        actionText = "Selected";
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
                    isSelected && "has-background-primary-dark"
                }`}
            >
                <p className="card-footer-item has-text-link">{actionText}</p>
            </footer>
        </div>
    );
};

export default OptionComponent;
