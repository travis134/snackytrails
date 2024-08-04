import React from "react";

import { Poll } from "@shared/types";

interface PollComponentProps {
    poll: Poll;
}

const PollComponent: React.FC<PollComponentProps> = ({ poll }) => {
    return (
        <div className="column is-one-third" key={poll.id}>
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <h2 className="title is-5">{poll.name}</h2>
                        </div>
                    </div>
                    <div className="content">{poll.description}</div>
                </div>
                <footer className="card-footer is-right-aligned">
                    <a href={"/#"} className="card-footer-item">
                        <span className="icon">
                            <i className="fas fa-arrow-right"></i>
                        </span>
                        <span>Make your voice heard!</span>
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default PollComponent;
