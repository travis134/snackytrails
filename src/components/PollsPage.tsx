import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Poll } from "@shared/types";
import { PollsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import EmptyComponent from "@components/EmptyComponent";
import ErrorComponent from "@components/ErrorComponent";
import PollComponent from "@components/PollComponent";

const limit = 10;

interface PollsPageProps {
    pollsService: PollsService;
}

const PollsPage: React.FC<PollsPageProps> = ({ pollsService }) => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [offset, setOffset] = useState(limit);
    const [more, setMore] = useState(false);

    // Load page data
    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const { polls: pollsData, more: hasMore } =
                    await pollsService.listPolls(limit, 0);
                setPolls(pollsData);
                setMore(hasMore);
            } catch (error) {
                setError(error as any);
            }

            setIsLoading(false);
        };

        fetchPolls();
    }, [pollsService]);

    // Load more page data
    const fetchMorePolls = useCallback(async () => {
        setIsLoadingMore(true);
        try {
            const { polls: pollsData, more } = await pollsService.listPolls(
                limit,
                offset
            );
            setPolls((prevPolls) => [...prevPolls, ...pollsData]);
            setMore(more);
            setOffset((prevOffset) => prevOffset + limit);
        } catch (error) {
            setError(error as any);
        }

        setIsLoadingMore(false);
    }, [pollsService, offset]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (polls.length === 0) {
        body = <EmptyComponent />;
    } else if (error) {
        body = <ErrorComponent error={error} />;
    } else {
        body = (
            <>
                <div className="fixed-grid has-1-cols-mobile has-1-cols-tablet has-2-cols-desktop mb-5">
                    <div className="grid">
                        {polls.map((poll) => (
                            <div className="cell" key={poll.id}>
                                <PollComponent poll={poll} />
                            </div>
                        ))}
                    </div>
                </div>
                {more && (
                    <button
                        className={`button is-primary is-light is-fullwidth ${
                            isLoadingMore && "is-loading"
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
            <section className="section">{body}</section>
        </>
    );
};

export default PollsPage;
