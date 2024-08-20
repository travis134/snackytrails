import React from "react";

import { Poll } from "@shared/types";

import PollComponent from "@components/PollComponent";

interface PollsComponentProps {
    polls: Poll[];
}

const PollsComponent: React.FC<PollsComponentProps> = ({ polls }) => {
    return (
        <div className="fixed-grid has-1-cols-mobile has-1-cols-tablet has-2-cols-desktop mb-5">
            <div className="grid">
                {polls.map((poll) => (
                    <div key={poll.id} className="cell">
                        <PollComponent poll={poll} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollsComponent;
