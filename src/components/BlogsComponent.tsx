import React from "react";

import { Blog } from "@shared/types";

import BlogPreviewComponent from "@components/BlogPreviewComponent";

interface BlogsComponentProps {
    blogs: Blog[];
}

const BlogsComponent: React.FC<BlogsComponentProps> = ({ blogs }) => {
    return (
        <>
            {blogs.map((blog) => (
                <BlogPreviewComponent key={blog.id} blog={blog} />
            ))}
        </>
    );
};

export default BlogsComponent;
