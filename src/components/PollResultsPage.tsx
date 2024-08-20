import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Poll, Option, Tally } from "@shared/types";
import { PollsService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import TallyComponent from "@components/TallyComponent";
import TallySkeletonComponent from "@components/TallySkeletonComponent";

interface PollPageProps {
    pollsService: PollsService;
}

const PollPage: React.FC<PollPageProps> = ({ pollsService }) => {
    const { id: pollId } = useParams<{ id: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [tallies, setTallies] = useState<Tally[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();

    // Load page data
    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const pollData = await pollsService.readPoll(pollId!);
                setPoll(pollData);

                const optionsData = await pollsService.listOptions(pollId!);
                setOptions(optionsData);

                const talliesData = await pollsService.tallyPoll(pollId!);
                setTallies(talliesData);
            } catch (error) {
                setError(error as any);
            }

            setIsLoading(false);
        };

        fetchPolls();
    }, [pollsService, pollId]);

    let body: ReactNode;
    if (isLoading) {
        body = <TallySkeletonComponent />;
    } else if (error) {
        body = <ErrorComponent error={error} />;
    } else if (poll) {
        body = (
            <TallyComponent poll={poll} options={options} tallies={tallies} />
        );
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
            <section className="section">{body}</section>
        </>
    );
};

export default PollPage;
