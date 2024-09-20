import React from "react";

import BlogContentComponent from "@components/BlogContentComponent";

interface BlogCreateFormComponentProps {
    id: string;
    setId: (id: string) => void;
    idError: string | null;
    author: string;
    setAuthor: (author: string) => void;
    authorError: string | null;
    content: string;
    setContent: (content: string) => void;
    contentError: string | null;
}

const BlogCreateFormComponent: React.FC<BlogCreateFormComponentProps> = ({
    id,
    setId,
    idError,
    author,
    setAuthor,
    authorError,
    content,
    setContent,
    contentError,
}) => {
    return (
        <form className="box mb-5">
            <div className="field mb-2">
                <label className="label">ID</label>
                <div className="control">
                    <input
                        className={`input ${idError ?? "is-danger"}`}
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Enter blog ID"
                    />
                </div>
                {idError && <p className="help is-danger">{idError}</p>}
            </div>

            <div className="field mb-2">
                <label className="label">Author</label>
                <div className="control">
                    <input
                        className={`input ${authorError ?? "is-danger"}`}
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author's name"
                    />
                </div>
                {authorError && <p className="help is-danger">{authorError}</p>}
            </div>

            <div className="field mb-2">
                <label className="label">Content</label>
                <div className="control">
                    <BlogContentComponent
                        content={content}
                        setContent={setContent}
                        contentError={contentError}
                        editable
                    />
                </div>
            </div>
        </form>
    );
};

export default BlogCreateFormComponent;
