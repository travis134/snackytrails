import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Routes from "@lib/routes";
import { useLoginQuery } from "@queries/useLogin";
import { BlogsService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import BlogContentComponent from "@components/BlogContentComponent";
import BlogContentSkeletonComponent from "./BlogContentSkeletonComponent";

interface BlogPageProps {
    blogsService: BlogsService;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogsService }) => {
    const { id: blogId } = useParams<{ id: string }>();
    const [content, setContent] = useState("");
    const [editing, setEditing] = useState(false);

    const { data: loggedIn } = useLoginQuery();

    const {
        data: blog,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["blog", blogId],
        queryFn: () => blogsService.readBlog(blogId!),
    });

    useEffect(() => {
        if (blog) {
            setContent(blog.content);
        }
    }, [blog]);

    let hero: ReactNode;
    let body: ReactNode;

    if (isLoading) {
        hero = <HeroSkeletonComponent />;
        body = (
            <article className="box mb-5">
                <BlogContentSkeletonComponent />
            </article>
        );
    } else if (error) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={error as any} />;
    } else {
        const title = blog!.id;
        const mungedTime = blog!.created.split(" ").join("T") + ".000Z";
        const formattedDate = new Date(mungedTime).toLocaleString();
        const subtitle = `${blog!.author} @ ${formattedDate}`;

        let buttons: ReactNode;
        if (loggedIn) {
            if (editing) {
                buttons = (
                    <div className="buttons is-right mt-5">
                        <button className="button is-danger">Delete</button>
                        <button
                            className="button"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </button>
                        <button className="button is-success">Save</button>
                    </div>
                );
            } else {
                buttons = (
                    <div className="buttons is-right mt-5">
                        <button
                            className="button"
                            onClick={() => setEditing(true)}
                        >
                            Edit
                        </button>
                    </div>
                );
            }
        }

        hero = <HeroComponent title={title} subtitle={subtitle} />;
        body = (
            <>
                <article className="box mb-5">
                    <BlogContentComponent
                        content={content}
                        setContent={setContent}
                        editable={editing}
                    />
                    {buttons}
                </article>
                <a
                    className={"button is-white has-text-primary is-fullwidth"}
                    href={Routes.BlogsRoute.href()}
                >
                    Read other blogs
                </a>
            </>
        );
    }

    return (
        <>
            {hero}
            <section className="section">{body}</section>
        </>
    );
};

export default BlogPage;
