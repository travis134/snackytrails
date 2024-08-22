import React from "react";

const BlogPreviewSkeletonComponent: React.FC = () => {
    return (
        <article className="box mb-5">
            <div className="subtitle skeleton-lines">
                <div />
            </div>
            <div className="preview mt-5 skeleton-lines">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} />
                ))}
            </div>
            <div className="skeleton-lines">
                <div />
            </div>
        </article>
    );
};

export default BlogPreviewSkeletonComponent;
