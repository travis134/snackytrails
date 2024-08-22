import React, { ReactNode } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Blog } from "@shared/types";
import { BlogsService } from "@types";

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
        data,
        error,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["blogs"],
        queryFn: ({ pageParam = 0 }) =>
            blogsService.listBlogs(limit, pageParam),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.more ? allPages.length * limit : undefined,
        initialPageParam: 0,
    });

    const blogs = data?.pages.flatMap((page) => page.blogs) || [];

    let hero: ReactNode;
    let body: ReactNode;

    if (isLoading) {
        hero = <HeroSkeletonComponent />;
        body = <BlogsSkeletonComponent />;
    } else if (error) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={error as any} />;
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
