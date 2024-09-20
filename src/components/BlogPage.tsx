import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Routes from "@lib/routes";
import { AuthorizationService, BlogsService } from "@types";

import {
    useReadBlog,
    useDeleteBlog,
    useUpdateBlog,
} from "@lib/queries/BlogQueries";
import { useAuthorization } from "@lib/queries/AuthorizationQueries";

import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import BlogContentComponent from "@components/BlogContentComponent";
import BlogContentSkeletonComponent from "@components/BlogContentSkeletonComponent";

interface BlogPageProps {
    blogsService: BlogsService;
    authorizationService: AuthorizationService;
}

const BlogPage: React.FC<BlogPageProps> = ({
    blogsService,
    authorizationService,
}) => {
    const { id: blogId } = useParams<{ id: string }>();
    const [content, setContent] = useState("");
    const [contentError, setContentError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    const { data: authorization } = useAuthorization({ authorizationService });

    const {
        data: blog,
        error: blogError,
        isPending: blogIsPending,
    } = useReadBlog({ blogsService, blogId: blogId! });

    const enableEditing = () => {
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
        setContent(blog!.content);
    };

    const { mutate: saveBlogMutation, isPending: saveBlogIsPending } =
        useUpdateBlog({
            blogsService,
            authorization: authorization!,
            blogId: blogId!,
        });
    const saveBlog = () => {
        const blogUpdate = { content };
        saveBlogMutation(blogUpdate, {
            onSuccess: () => {
                cancelEditing();
            },
        });
    };

    const { mutate: deleteBlogMutation, isPending: deleteBlogIsPending } =
        useDeleteBlog({
            blogsService,
            authorization: authorization!,
            blogId: blogId!,
        });
    const deleteBlog = () => {
        deleteBlogMutation(undefined, {
            onSuccess: () => {
                navigate(Routes.BlogsRoute.href());
            },
        });
    };

    const editIsPending = saveBlogIsPending || deleteBlogIsPending;

    useEffect(() => {
        if (blog) {
            setContent(blog.content);
        }
    }, [blog]);

    useEffect(() => {
        if (!content) {
            setContentError("An content value must be provided");
        } else {
            setContentError(null);
        }
    }, [content]);

    let hero: ReactNode;
    let body: ReactNode;

    if (blogIsPending) {
        hero = <HeroSkeletonComponent />;
        body = (
            <article className="box mb-5">
                <BlogContentSkeletonComponent />
            </article>
        );
    } else if (blogError) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={blogError as any} />;
    } else {
        const title = blog!.id;
        const mungedTime = blog!.created.split(" ").join("T") + ".000Z";
        const formattedDate = new Date(mungedTime).toLocaleString();
        const subtitle = `${blog!.author} @ ${formattedDate}`;

        let buttons: ReactNode;
        if (editing) {
            buttons = (
                <div className="buttons is-right mt-5">
                    <button
                        className="button is-danger"
                        onClick={deleteBlog}
                        disabled={editIsPending}
                    >
                        Delete
                    </button>
                    <button
                        className="button"
                        onClick={cancelEditing}
                        disabled={editIsPending}
                    >
                        Cancel
                    </button>
                    <button
                        className="button is-primary has-text-white"
                        onClick={saveBlog}
                        disabled={editIsPending || !!contentError}
                    >
                        Save
                    </button>
                </div>
            );
        } else {
            buttons = (
                <div className="buttons is-right mt-5">
                    <button
                        className="button is-primary has-text-white"
                        onClick={enableEditing}
                    >
                        Edit
                    </button>
                </div>
            );
        }

        hero = <HeroComponent title={title} subtitle={subtitle} />;
        body = (
            <>
                <article className="box mb-5">
                    <BlogContentComponent
                        content={content}
                        setContent={setContent}
                        contentError={contentError}
                        editable={editing && !!authorization}
                        disabled={editIsPending}
                    />
                    {authorization && buttons}
                </article>
                <a
                    className={"button is-white has-text-primary is-fullwidth"}
                    href={Routes.BlogsRoute.href()}
                >
                    Read more
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
