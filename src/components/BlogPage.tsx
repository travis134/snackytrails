import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Blog } from "@shared/types";
import { BlogsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import EmptyState from "@components/EmptyComponent";
import BlogComponent from "@components/BlogComponent";

const limit = 1;

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
        setIsLoadingMore(true);
    }, [blogsService, offset]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (blogs.length === 0) {
        body = <EmptyState />;
    } else {
        body = (
            <>
                <div className="columns is-multiline">
                    {blogs.map((blog) => (
                        <div className="column is-one-third" key={blog.id}>
                            <BlogComponent key={blog.id} blog={blog} />
                        </div>
                    ))}
                </div>
                {more && (
                    <div className="has-text-centered mt-4">
                        <button
                            className="button is-primary"
                            onClick={() => fetchMoreBlogs()}
                            disabled={isLoadingMore}
                        >
                            See more
                        </button>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="container">
            <section className="hero">
                <div className="hero-body">
                    <p className="title">See what we've been up to</p>
                    <p className="subtitle">Check out these incredible blogs</p>
                </div>
            </section>
            <section>{body}</section>
        </div>
    );
};

export default BlogPage;
