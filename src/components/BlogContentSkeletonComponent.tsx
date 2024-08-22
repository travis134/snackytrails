import React from "react";

const BlogContentSkeletonComponent: React.FC = () => {
    return (
        <div className="content skeleton-lines">
            {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} />
            ))}
        </div>
    );
};

export default BlogContentSkeletonComponent;
