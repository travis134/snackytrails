import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Routes from "@lib/routes";
import { AuthorizationService, BlogsService } from "@types";

import { useCreateBlog, useListBlogs } from "@lib/queries/BlogQueries";
import { useAuthorization } from "@lib/queries/AuthorizationQueries";

import EmptyComponent from "@components/EmptyComponent";
import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import BlogsComponent from "@components/BlogsComponent";
import BlogsSkeletonComponent from "@components/BlogsSkeletonComponent";
import BlogCreateFormComponent from "./BlogCreateFormComponent";

const limit = 10;
const idPattern = /^[a-z]+(-[a-z]+)*$/;

interface BlogsPageProps {
    blogsService: BlogsService;
    authorizationService: AuthorizationService;
}

const BlogsPage: React.FC<BlogsPageProps> = ({
    blogsService,
    authorizationService,
}) => {
    const [id, setId] = useState("");
    const [idError, setIdError] = useState<string | null>(null);
    const [author, setAuthor] = useState("");
    const [authorError, setAuthorError] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [contentError, setContentError] = useState<string | null>(null);
    const [authoring, setAuthoring] = useState(false);
    const navigate = useNavigate();

    const { data: authorization } = useAuthorization({ authorizationService });

    const {
        data: paginatedBlogs,
        error: paginatedBlogsError,
        isPending: paginatedBlogsIsPending,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useListBlogs({ blogsService, limit });

    const blogs = paginatedBlogs?.pages.flatMap((page) => page.blogs) || [];

    const enableAuthoring = () => {
        setAuthoring(true);
    };

    const cancelAuthoring = () => {
        setAuthoring(false);
        setId("");
        setAuthor("");
        setContent("");
    };

    const { mutate: createBlogMutation, isPending: createBlogIsPending } =
        useCreateBlog({ blogsService, authorization: authorization! });
    const createBlog = () => {
        const blogCreate = { id, author, content };
        createBlogMutation(blogCreate, {
            onSuccess: () => {
                navigate(Routes.BlogRoute.href({ id }));
            },
        });
    };

    useEffect(() => {
        if (!id) {
            setIdError("An ID value must be provided");
        } else if (!idPattern.test(id)) {
            setIdError("The ID value must be lowercase words separated by hyphens");
        } else {
            setIdError(null);
        }
    }, [id]);

    useEffect(() => {
        if (!author) {
            setAuthorError("An author value must be provided");
        } else {
            setAuthorError(null);
        }
    }, [author]);

    useEffect(() => {
        if (!content) {
            setContentError("A content value must be provided");
        } else {
            setContentError(null);
        }
    }, [content]);

    let hero: ReactNode;
    let body: ReactNode;

    if (paginatedBlogsIsPending) {
        hero = <HeroSkeletonComponent />;
        body = <BlogsSkeletonComponent />;
    } else if (paginatedBlogsError) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={paginatedBlogsError as any} />;
    } else if (blogs.length === 0) {
        hero = <HeroSkeletonComponent />;
        body = <EmptyComponent />;
    } else {
        let buttons: ReactNode;
        if (authoring) {
            buttons = (
                <div className="buttons is-right mb-5">
                    <button
                        className="button"
                        onClick={cancelAuthoring}
                        disabled={createBlogIsPending}
                    >
                        Cancel
                    </button>
                    <button
                        className="button is-primary has-text-white"
                        onClick={createBlog}
                        disabled={
                            createBlogIsPending ||
                            !!idError ||
                            !!authorError ||
                            !!contentError
                        }
                    >
                        Submit
                    </button>
                </div>
            );
        } else {
            buttons = (
                <div className="buttons is-right mb-5">
                    <button
                        className="button is-primary has-text-white"
                        onClick={enableAuthoring}
                    >
                        Create
                    </button>
                </div>
            );
        }

        hero = (
            <HeroComponent
                title="See what we've been up to"
                subtitle="Check out these incredible blogs"
            />
        );
        body = (
            <>
                {authorization && (
                    <>
                        {buttons}
                        {authoring && (
                            <BlogCreateFormComponent
                                id={id}
                                setId={setId}
                                idError={idError}
                                author={author}
                                setAuthor={setAuthor}
                                authorError={authorError}
                                content={content}
                                setContent={setContent}
                                contentError={contentError}
                            />
                        )}
                    </>
                )}
                <BlogsComponent blogs={blogs} />
                {hasNextPage && (
                    <button
                        className={`button is-primary is-light is-fullwidth ${
                            isFetchingNextPage && "is-loading"
                        }`}
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        See more
                    </button>
                )}
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

export default BlogsPage;
