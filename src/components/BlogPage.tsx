import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Blog } from "@shared/types";
import Routes from "@lib/routes";
import { BlogsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import ErrorComponent from "@components/ErrorComponent";
import BlogComponent from "@components/BlogComponent";

interface BlogPageProps {
    blogsService: BlogsService;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogsService }) => {
    const { id: blogId } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogData = await blogsService.readBlog(blogId!);
                setBlog(blogData);
            } catch (error) {
                setError(error as any);
            }

            setIsLoading(false);
        };

        fetchBlog();
    }, [blogsService, blogId]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (error) {
        body = <ErrorComponent error={error} />;
    } else {
        body = (
            <>
                <BlogComponent blog={blog!} />
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

export default BlogPage;
