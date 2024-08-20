import React from "react";

const TallySkeletonComponent: React.FC = () => {
    return (
        <div className="box p-5">
            <div className="content">
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i} className="mb-5">
                            <div className="media">
                                <div className="media-content">
                                    <p className="is-size-5 skeleton-lines">
                                        <div />
                                        <div />
                                    </p>
                                    <div />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="skeleton-lines">
                <div />
            </p>
        </div>
    );
};

export default TallySkeletonComponent;
