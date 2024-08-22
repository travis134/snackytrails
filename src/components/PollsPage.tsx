import React, { ReactNode } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { PollsService } from "@types";

import EmptyComponent from "@components/EmptyComponent";
import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import PollsComponent from "@components/PollsComponent";
import PollsSkeletonComponent from "@components/PollsSkeletonComponent";

const limit = 2;

interface PollsPageProps {
    pollsService: PollsService;
}

const PollsPage: React.FC<PollsPageProps> = ({ pollsService }) => {
    const {
        data,
        error,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["polls"],
        queryFn: ({ pageParam = 0 }) =>
            pollsService.listPolls(limit, pageParam),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.more ? allPages.length * limit : undefined,
        initialPageParam: 0,
    });

    const polls = data?.pages.flatMap((page) => page.polls) || [];

    let hero: ReactNode;
    let body: ReactNode;
    if (isLoading) {
        hero = <HeroSkeletonComponent />;
        body = <PollsSkeletonComponent />;
    } else if (error) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={error as any} />;
    } else if (polls.length === 0) {
        hero = (
            <HeroComponent
                title="We want to hear from you!"
                subtitle="Check out these awesome polls"
            />
        );
        body = <EmptyComponent />;
    } else {
        hero = (
            <HeroComponent
                title="We want to hear from you!"
                subtitle="Check out these awesome polls"
            />
        );
        body = (
            <>
                <PollsComponent polls={polls} />
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

export default PollsPage;
