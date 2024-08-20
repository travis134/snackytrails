import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Blog } from "@shared/types";
import Routes from "@lib/routes";
import { BlogsService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import BlogContentComponent from "@components/BlogContentComponent";
import BlogContentSkeletonComponent from "./BlogContentSkeletonComponent";

interface BlogPageProps {
    blogsService: BlogsService;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogsService }) => {
    const { id: blogId } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();

    // Load page data
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

    let title: string;
    let subtitle: string;
    let body: ReactNode;
    if (isLoading) {
        title = "Loading";
        subtitle = "Hold your horses while we load this awesome blog";
        body = (
            <article className="box mb-5">
                <BlogContentSkeletonComponent />
            </article>
        );
    } else if (error) {
        title = "Uh oh, partner!";
        subtitle =
            "Looks like this blog got lost on the trail. How about a quick refresh to see if it finds its way?";
        body = <ErrorComponent error={error} />;
    } else {
        title = blog!.id;
        const mungedTime = blog!.created.split(" ").join("T") + ".000Z";
        const formattedDate = new Date(mungedTime).toLocaleString();
        subtitle = `${blog!.author} @ ${formattedDate}`;

        body = (
            <>
                <article className="box mb-5">
                    <BlogContentComponent blog={blog!} />
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
            <section className="hero">
                <div className="hero-body">
                    <p className="title">{title}</p>
                    <p className="subtitle">{subtitle}</p>
                </div>
            </section>
            <section className="section">{body}</section>
        </>
    );
};

export default BlogPage;
