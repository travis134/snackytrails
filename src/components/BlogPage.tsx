import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Blog } from "@shared/types";
import { BlogsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import EmptyState from "@components/EmptyComponent";
import BlogComponent from "@components/BlogComponent";

const limit = 10;

interface BlogPageProps {
    blogsService: BlogsService;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogsService }) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [offset, setOffset] = useState(limit);
    const [more, setMore] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { blogs: blogsData, more: hasMore } =
                await blogsService.listBlogs(limit, 0);
            setBlogs(blogsData);
            setMore(hasMore);
            setIsLoading(false);
        };

        fetchBlogs();
    }, [blogsService]);

    const fetchMoreBlogs = useCallback(async () => {
        setIsLoadingMore(true);
        const { blogs: blogsData, more } = await blogsService.listBlogs(
            limit,
            offset
        );
        setBlogs((prevBlogs) => [...prevBlogs, ...blogsData]);
        setMore(more);
        setOffset((prevOffset) => prevOffset + limit);
        setIsLoadingMore(false);
    }, [blogsService, offset]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (blogs.length === 0) {
        body = <EmptyState />;
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
            <div className="container">
                <section>{body}</section>
            </div>
        </>
    );
};

export default BlogPage;
