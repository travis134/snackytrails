import React, { ReactNode } from "react";

import { BlogsService } from "@types";

import { useBlogs } from "@lib/queries/BlogQueries";

import EmptyComponent from "@components/EmptyComponent";
import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import BlogsComponent from "@components/BlogsComponent";
import BlogsSkeletonComponent from "@components/BlogsSkeletonComponent";

const limit = 10;

interface BlogsPageProps {
    blogsService: BlogsService;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ blogsService }) => {
    const {
        data: paginatedBlogs,
        error: paginatedBlogsError,
        isPending: paginatedBlogsIsPending,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useBlogs({ blogsService, limit });

    const blogs = paginatedBlogs?.pages.flatMap((page) => page.blogs) || [];

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
        hero = (
            <HeroComponent
                title="See what we've been up to"
                subtitle="Check out these incredible blogs"
            />
        );
        body = (
            <>
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
