import React from "react";

import BlogPreviewSkeletonComponent from "@components/BlogPreviewSkeletonComponent";

const BlogsSkeletonComponent: React.FC = () => {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <BlogPreviewSkeletonComponent key={i} />
            ))}
        </>
    );
};

export default BlogsSkeletonComponent;
