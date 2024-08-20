import React from "react";

import PollSkeletonComponent from "@components/PollSkeletonComponent";

const PollsSkeletonComponent: React.FC = () => {
    return (
        <div className="fixed-grid has-1-cols-mobile has-1-cols-tablet has-2-cols-desktop mb-5">
            <div className="grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="cell">
                        <PollSkeletonComponent />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollsSkeletonComponent;
