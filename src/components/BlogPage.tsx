import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Blog } from "@shared/types";
import Routes from "@lib/routes";
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
        body = <ErrorComponent error={error} />;
    } else {
        const title = blog!.id;
        const mungedTime = blog!.created.split(" ").join("T") + ".000Z";
        const formattedDate = new Date(mungedTime).toLocaleString();
        const subtitle = `${blog!.author} @ ${formattedDate}`;

        hero = <HeroComponent title={title} subtitle={subtitle} />;
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
            {hero}
            <section className="section">{body}</section>
        </>
    );
};

export default BlogPage;
