import React, { useEffect, useState } from "react";
import { Renderer, marked } from "marked";

import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github-dark.css";
import plaintext from "highlight.js/lib/languages/plaintext";
import scss from "highlight.js/lib/languages/scss";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";

import { Blog } from "@shared/types";

hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("typescript", typescript);

interface BlogContentComponentProps {
    blog: Blog;
}

const BlogContentComponent: React.FC<BlogContentComponentProps> = ({
    blog,
}) => {
    const [content, setContent] = useState("");

    // Translate markdown to html and perform code highlighting
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
        <div
            className="content"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default BlogContentComponent;
