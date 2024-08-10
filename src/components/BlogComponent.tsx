import React, { useEffect, useState } from "react";
import { Renderer, marked } from "marked";

import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github-dark.css";
import javascript from "highlight.js/lib/languages/javascript";
import plaintext from "highlight.js/lib/languages/plaintext";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";

import { Blog } from "@shared/types";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("typescript", typescript);

interface BlogComponentProps {
    blog: Blog;
}

const BlogComponent: React.FC<BlogComponentProps> = ({ blog }) => {
    const [content, setContent] = useState("");
    const mungedTime = blog.created.split(" ").join("T") + ".000Z";
    const formattedDate = new Date(mungedTime).toLocaleString();

    useEffect(() => {
        const renderer = new Renderer();
        renderer.code = ({ text, lang }) => {
            const validLanguage =
                lang && hljs.getLanguage(lang) ? lang : "plaintext";
            const highlighted = hljs.highlight(text, {
                language: validLanguage,
                ignoreIllegals: true,
            }).value;
            return `<pre style="background-color: #0E1116"><code style="color: #E5E7EB" class="hljs ${validLanguage}">${highlighted}</code></pre>`;
        };

        marked.setOptions({
            renderer,
            gfm: true,
            breaks: true,
        });

        const parsedContent = marked.parse(blog.content, {
            async: false,
        }) as string;
        setContent(parsedContent);
    }, [blog.content]);

    return (
        <article className="card mb-5">
            <div className="card-content">
                <h4 className="title is-5 has-text-grey-light mb-2">
                    {blog.id}
                </h4>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <p className="has-text-right has-text-grey mt-4">
                    - {blog.author}{" "}
                    <span className="has-text-weight-light">@ </span>
                    <time dateTime={mungedTime} className="is-italic">
                        {formattedDate}
                    </time>
                </p>
            </div>
        </article>
    );
};

export default BlogComponent;
