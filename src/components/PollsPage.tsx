import React, { ReactNode, useEffect, useState } from "react";

import { Poll } from "@shared/types";
import { PollsService } from "@types";

import PollComponent from "@components/PollComponent";
import LoadingComponent from "@components/LoadingComponent";

interface PollsPageProps {
    pollsService: PollsService;
}

const PollsPage: React.FC<PollsPageProps> = ({ pollsService }) => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            const pollsData = await pollsService.listPolls();
            setPolls(pollsData);
            setIsLoading(false);
        };

        fetchPolls();
    }, [pollsService]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else {
        body = (
            <div className="columns is-multiline">
                {polls.map((poll) => (
                    <PollComponent key={poll.id} poll={poll} />
                ))}
            </div>
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
            <section>{body}</section>
        </>
    );
};

export default PollsPage;
