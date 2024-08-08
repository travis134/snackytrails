import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Poll, Option } from "@shared/types";
import { PollsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import PollVoteComponent from "@components/PollVoteComponent";
import ErrorComponent from "./ErrorComponent";

interface PollPageProps {
    pollsService: PollsService;
}

const PollPage: React.FC<PollPageProps> = ({ pollsService }) => {
    const { id: pollId } = useParams<{ id: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const pollData = await pollsService.readPoll(pollId!);
                setPoll(pollData);

                const optionsData = await pollsService.listOptions(pollId!);
                setOptions(optionsData);
            } catch (error) {
                setError(error as any);
            }

            setIsLoading(false);
        };

        fetchPolls();
    }, [pollsService, pollId]);

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (error) {
        body = <ErrorComponent error={error} />;
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
