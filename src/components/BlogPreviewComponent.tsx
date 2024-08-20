import React from "react";

import { Blog } from "@shared/types";
import Routes from "@lib/routes";

import BlogContentComponent from "@components/BlogContentComponent";

interface BlogPreviewComponentProps {
    blog: Blog;
}

const BlogPreviewComponent: React.FC<BlogPreviewComponentProps> = ({
    blog,
}) => {
    const mungedTime = blog.created.split(" ").join("T") + ".000Z";
    const formattedDate = new Date(mungedTime).toLocaleString();

    return (
        <article className="box mb-5">
            <a href={Routes.BlogRoute.href({ id: blog.id })}>
                <h4 className="title is-5 has-text-primary">{blog.id}</h4>
            </a>
            <div className="preview mt-5 ">
                <BlogContentComponent blog={blog} />
            </div>
            <p className="has-text-right has-text-grey">
                - {blog.author}{" "}
                <span className="has-text-weight-light">@ </span>
                <time dateTime={mungedTime} className="is-italic">
                    {formattedDate}
                </time>
            </p>
        </article>
    );
};

export default BlogPreviewComponent;
