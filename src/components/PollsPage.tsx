import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Poll } from "@shared/types";
import { PollsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import EmptyState from "@components/EmptyComponent";
import PollComponent from "@components/PollComponent";

const limit = 10;

interface PollsPageProps {
    pollsService: PollsService;
}

const PollsPage: React.FC<PollsPageProps> = ({ pollsService }) => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [offset, setOffset] = useState(limit);
    const [more, setMore] = useState(false);

    useEffect(() => {
        const fetchPolls = async () => {
            const { polls: pollsData, more: hasMore } =
                await pollsService.listPolls(limit, 0);
            setPolls(pollsData);
            setMore(hasMore);
            setIsLoading(false);
        };

        fetchPolls();
    }, [pollsService]);

    const fetchMorePolls = useCallback(async () => {
        setIsLoadingMore(true);
        const { polls: pollsData, more } = await pollsService.listPolls(
            limit,
            offset
        );
        setPolls((prevPolls) => [...prevPolls, ...pollsData]);
        setMore(more);
        setOffset((prevOffset) => prevOffset + limit);
        setIsLoadingMore(false);
    }, [pollsService, offset]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (polls.length === 0) {
        body = <EmptyState />;
    } else {
        body = (
            <>
                {polls.map((poll) => (
                    <PollComponent key={poll.id} poll={poll} />
                ))}
                {more && (
                    <button
                        className={`button is-primary is-fullwidth ${
                            isLoading && "is-loading"
                        }`}
                        onClick={() => fetchMorePolls()}
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
                    <p className="title">We want to hear from you!</p>
                    <p className="subtitle">Check out these awesome polls</p>
                </div>
            </section>
            <div className="container">
                <section>{body}</section>
            </div>
        </>
    );
};

export default PollsPage;
