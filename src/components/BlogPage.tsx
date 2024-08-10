import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Blog } from "@shared/types";
import { BlogsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import EmptyComponent from "@components/EmptyComponent";
import ErrorComponent from "@components/ErrorComponent";
import BlogComponent from "@components/BlogComponent";

const limit = 10;

interface BlogPageProps {
    blogsService: BlogsService;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogsService }) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [offset, setOffset] = useState(limit);
    const [more, setMore] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { blogs: blogsData, more } = await blogsService.listBlogs(
                    limit,
                    0
                );
                setBlogs(blogsData);
                setMore(more);
            } catch (error) {
                setError(error as any);
            }

            setIsLoading(false);
        };

        fetchBlogs();
    }, [blogsService]);

    const fetchMoreBlogs = useCallback(async () => {
        setIsLoadingMore(true);
        try {
            const { blogs: blogsData, more } = await blogsService.listBlogs(
                limit,
                offset
            );
            setBlogs((prevBlogs) => [...prevBlogs, ...blogsData]);
            setMore(more);
            setOffset((prevOffset) => prevOffset + limit);
        } catch (error) {
            setError(error as any);
        }

        setIsLoadingMore(false);
    }, [blogsService, offset]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (blogs.length === 0) {
        body = <EmptyComponent />;
    } else if (error) {
        body = <ErrorComponent error={error} />;
    } else {
        body = (
            <>
                {blogs.map((blog) => (
                    <BlogComponent key={blog.id} blog={blog} />
                ))}
                {more && (
                    <button
                        className={`button is-primary is-fullwidth ${
                            isLoading && "is-loading"
                        }`}
                        onClick={() => fetchMoreBlogs()}
                        disabled={isLoadingMore}
                    >
                        See more
                    </button>
                )}
            </>
        );
    }

    return (
        <>
            <section className="hero">
                <div className="hero-body">
                    <p className="title">See what we've been up to</p>
                    <p className="subtitle">Check out these incredible blogs</p>
                </div>
            </section>
            <section>{body}</section>
        </>
    );
};

export default BlogPage;
