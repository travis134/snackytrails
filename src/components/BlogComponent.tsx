import React from "react";
import { marked } from "marked";

import { Blog } from "@shared/types";

interface BlogComponentProps {
    blog: Blog;
}

const BlogComponent: React.FC<BlogComponentProps> = ({ blog }) => {
    const content = marked.parse(blog.content, { async: false }) as string;
    const formattedDate = new Date(
        Date.parse(`${blog.created}Z`)
    ).toLocaleString();

    return (
        <article className="message">
            <div className="message-body">
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <p>
                    - {blog.author} @ {formattedDate}
                </p>
            </div>
        </article>
    );
};

export default BlogComponent;
