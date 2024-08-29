import React, { ReactNode, useEffect, useState } from "react";
import { Renderer, marked } from "marked";

import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github-dark.css";
import plaintext from "highlight.js/lib/languages/plaintext";
import scss from "highlight.js/lib/languages/scss";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("typescript", typescript);

interface BlogContentComponentProps {
    content: string;
    setContent?: (content: string) => void;
    editable?: boolean;
}

const BlogContentComponent: React.FC<BlogContentComponentProps> = ({
    content,
    setContent,
    editable,
}) => {
    const [renderableContent, setRenderableContent] = useState("");

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

        const parsedContent = marked.parse(content, {
            async: false,
        }) as string;
        setRenderableContent(parsedContent);
    }, [content]);

    const view = (
        <div
            className="content"
            dangerouslySetInnerHTML={{ __html: renderableContent }}
        />
    );

    const edit = (
        <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent!(e.target.value)}
        />
    );

    let body: ReactNode;
    if (editable) {
        body = (
            <div className="columns">
                <div className="column">
                    <label className="label">Edit</label>
                    <div className="control">{edit}</div>
                </div>

                <div className="column">
                    <label className="label">Preview</label>
                    <div className="control">{view}</div>
                </div>
            </div>
        );
    } else {
        body = view;
    }

    return body;
};

export default BlogContentComponent;
