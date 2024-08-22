import React, { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { PollsService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import TallyComponent from "@components/TallyComponent";
import TallySkeletonComponent from "@components/TallySkeletonComponent";

interface PollPageProps {
    pollsService: PollsService;
}

const PollPage: React.FC<PollPageProps> = ({ pollsService }) => {
    const { id: pollId } = useParams<{ id: string }>();

    // Fetch poll data
    const {
        data: poll,
        error: pollError,
        isLoading: isPollLoading,
    } = useQuery({
        queryKey: ["poll", pollId],
        queryFn: () => pollsService.readPoll(pollId!),
    });

    // Fetch options data
    const {
        data: options,
        error: optionsError,
        isLoading: isOptionsLoading,
    } = useQuery({
        queryKey: ["pollOptions", pollId],
        queryFn: () => pollsService.listOptions(pollId!),
    });

    // Fetch tally data
    const {
        data: tallies,
        error: talliesError,
        isLoading: isTalliesLoading,
    } = useQuery({
        queryKey: ["pollTallies", pollId],
        queryFn: () => pollsService.tallyPoll(pollId!),
    });

    const isLoading = isPollLoading || isOptionsLoading || isTalliesLoading;
    const error = pollError || optionsError || talliesError;

    let hero: ReactNode;
    let body: ReactNode;
    if (isLoading) {
        hero = <HeroSkeletonComponent />;
        body = <TallySkeletonComponent />;
    } else if (error) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={error as any} />;
    } else {
        hero = (
            <HeroComponent title={poll!.name} subtitle={poll!.description} />
        );
        body = (
            <TallyComponent
                poll={poll!}
                options={options!}
                tallies={tallies!}
            />
        );
    }

    return (
        <>
            {hero}
            <section className="section">{body}</section>
        </>
    );
};

export default PollPage;
