import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Poll, Option } from "@shared/types";
import { PollsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import PollVoteComponent from "@components/PollVoteComponent";

interface PollPageProps {
    pollsService: PollsService;
}

const PollPage: React.FC<PollPageProps> = ({ pollsService }) => {
    const { id: pollId } = useParams<{ id: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            const pollData = await pollsService.readPoll(pollId!);
            setPoll(pollData);

            const optionsData = await pollsService.listOptions(pollId!);
            setOptions(optionsData);

            setIsLoading(false);
        };

        fetchPolls();
    }, [pollsService, pollId]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (poll) {
        body = <PollVoteComponent poll={poll} options={options} />;
    }

    return (
        <>
            {poll && (
                <section className="hero">
                    <div className="hero-body">
                        <p className="title">{poll.name}</p>
                        <p className="subtitle">{poll.description}</p>
                    </div>
                </section>
            )}
            <div className="container">
                <section>{body}</section>
            </div>
        </>
    );
};

export default PollPage;
