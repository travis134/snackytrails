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
        setIsLoadingMore(true);
    }, [pollsService, offset]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (polls.length === 0) {
        body = <EmptyState />;
    } else {
        body = (
            <>
                <div className="columns is-multiline">
                    {polls.map((poll) => (
                        <div className="column is-one-third" key={poll.id}>
                            <PollComponent key={poll.id} poll={poll} />
                        </div>
                    ))}
                </div>
                {more && (
                    <div className="has-text-centered mt-4">
                        <button
                            className="button is-primary"
                            onClick={() => fetchMorePolls()}
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
                    <p className="title">We want to hear from you!</p>
                    <p className="subtitle">Check out these awesome polls</p>
                </div>
            </section>
            <section>{body}</section>
        </div>
    );
};

export default PollsPage;
