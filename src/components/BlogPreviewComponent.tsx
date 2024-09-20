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
    const subtitle = `- ${blog.author} @ ${formattedDate}`;

    return (
        <a href={Routes.BlogRoute.href({ id: blog.id })}>
            <article className="box mb-5">
                <h4 className="subtitle has-text-link">{blog.id}</h4>

                <div className="preview mt-5 ">
                    <BlogContentComponent
                        content={blog.content}
                        contentError={null}
                    />
                </div>
                <p>{subtitle}</p>
            </article>
        </a>
    );
};

export default BlogPreviewComponent;
