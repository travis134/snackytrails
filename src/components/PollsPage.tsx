import React, { useEffect, useState } from "react";

import { Poll } from "@shared/types";
import { PollsService } from "@types";

import PollComponent from "@components/PollComponent";

interface PollsPageProps {
    pollsService: PollsService;
}

const PollsPage: React.FC<PollsPageProps> = ({ pollsService }) => {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        const fetchPolls = async () => {
            const pollsData = await pollsService.listPolls();
            setPolls(pollsData);
        };

        fetchPolls();
    }, []);

    return (
        <>
            <section className="hero">
                <div className="hero-body">
                    <p className="title">We want to hear from you!</p>
                    <p className="subtitle">Check out these awesome polls</p>
                </div>
            </section>
            <div className="columns is-multiline">
                {polls.map((poll) => (
                    <PollComponent poll={poll} />
                ))}
            </div>
        </>
    );
};

export default PollsPage;
