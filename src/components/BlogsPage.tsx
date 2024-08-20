import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Blog } from "@shared/types";
import { BlogsService } from "@types";

import EmptyComponent from "@components/EmptyComponent";
import ErrorComponent from "@components/ErrorComponent";
import BlogsComponent from "@components/BlogsComponent";
import BlogsSkeletonComponent from "@components/BlogsSkeletonComponent";

const limit = 10;

interface BlogsPageProps {
    blogsService: BlogsService;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ blogsService }) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [offset, setOffset] = useState(limit);
    const [more, setMore] = useState(false);

    // Load page data
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

    // Load more page data
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
        body = <BlogsSkeletonComponent />;
    } else if (blogs.length === 0) {
        body = <EmptyComponent />;
    } else if (error) {
        body = <ErrorComponent error={error} />;
    } else {
        body = (
            <>
                <BlogsComponent blogs={blogs} />
                {more && (
                    <button
                        className={`button is-primary is-light is-fullwidth ${
                            isLoadingMore && "is-loading"
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
            <section className="section">{body}</section>
        </>
    );
};

export default BlogsPage;
