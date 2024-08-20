import React from "react";

const BlogContentSkeletonComponent: React.FC = () => {
    return (
        <div className="content skeleton-lines">{Array(100).fill(<div />)}</div>
    );
};

export default BlogContentSkeletonComponent;
