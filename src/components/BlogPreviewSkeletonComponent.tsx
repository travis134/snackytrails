import React from "react";

const BlogPreviewSkeletonComponent: React.FC = () => {
    return (
        <article className="box mb-5">
            <h4 className="subtitle skeleton-lines">
                <div />
            </h4>
            <div className="preview mt-5 skeleton-lines">
                {Array(12).fill(<div />)}
            </div>
            <p className="skeleton-lines">
                <div />
            </p>
        </article>
    );
};

export default BlogPreviewSkeletonComponent;
