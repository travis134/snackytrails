import React from "react";

import { Poll } from "@shared/types";
import Routes from "@lib/routes";

interface PollComponentProps {
    poll: Poll;
}

const PollComponent: React.FC<PollComponentProps> = ({ poll }) => {
    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">{poll.name}</p>
            </header>
            <div className="card-content">
                <div className="content">{poll.description}</div>
            </div>
            <footer className="card-footer">
                <a
                    href={Routes.PollRoute.href({ id: poll.id })}
                    className="card-footer-item"
                >
                    <span className="icon">
                        <i className="fas fa-arrow-right"></i>
                    </span>
                    <span>Make your voice heard!</span>
                </a>
            </footer>
        </div>
    );
};

export default PollComponent;
