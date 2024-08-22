import React from "react";

const TallySkeletonComponent: React.FC = () => {
    return (
        <div className="box p-5">
            <div className="content">
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i} className="mt-2 mb-5">
                            <div className="media">
                                <div className="media-content">
                                    <div className="is-size-5 skeleton-lines mb-4">
                                        <div className="mb-2" />
                                        <div />
                                    </div>
                                    <div />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="skeleton-lines">
                <div />
            </div>
        </div>
    );
};

export default TallySkeletonComponent;
