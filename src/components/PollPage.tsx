import React, { ReactNode, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { ErrorCode, isAppError } from "@shared/errors";
import { Option, Vote } from "@shared/types";
import Routes from "@lib/routes";
import { PollsService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import OptionsComponent from "@components/OptionsComponent";
import OptionsSkeletonComponent from "@components/OptionsSkeletonComponent";

interface AlreadyVotedModalProps {
    viewResults: () => void;
}

const AlreadyVotedModal: React.FC<AlreadyVotedModalProps> = ({
    viewResults,
}) => {
    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Whoa there, partner!</p>
                </header>
                <section className="modal-card-body">
                    <p>
                        You've already wrangled your vote in this poll. No
                        double-dipping in these parts, just sit tight and enjoy
                        the ride!
                    </p>
                </section>
                <footer className="modal-card-foot">
                    <div className="buttons ">
                        <button
                            className="button is-primary has-text-white"
                            onClick={viewResults}
                        >
                            See results
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

interface PollPageProps {
    pollsService: PollsService;
}

const PollPage: React.FC<PollPageProps> = ({ pollsService }) => {
    const navigate = useNavigate();
    const { id: pollId } = useParams<{ id: string }>();
    const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);

    // Fetch poll data
    const {
        data: poll,
        error: pollError,
        isLoading: isPollLoading,
    } = useQuery({
        queryKey: ["poll", pollId],
        queryFn: () => pollsService.readPoll(pollId!),
    });

    // Fetch poll options data
    const {
        data: options,
        error: optionsError,
        isLoading: isOptionsLoading,
    } = useQuery({
        queryKey: ["pollOptions", pollId],
        queryFn: () => pollsService.listOptions(pollId!),
    });

    const pollLoading = isPollLoading || isOptionsLoading;
    let error = pollError || optionsError;

    // Let the user toggle selections on and off
    const onClickOption = (clickedOption: Option) => {
        const alreadySelected = selectedOptionIds.includes(clickedOption.id);

        if (alreadySelected) {
            setSelectedOptionIds(
                selectedOptionIds.filter(
                    (optionId) => optionId !== clickedOption.id
                )
            );
        } else {
            if (poll!.selections === "single") {
                setSelectedOptionIds([clickedOption.id]);
            } else {
                setSelectedOptionIds([...selectedOptionIds, clickedOption.id]);
            }
        }
    };

    // Take the user to the poll results page
    const viewResults = () => {
        navigate(Routes.PollResultsRoute.href({ id: pollId! }));
    };

    // Handle the user's submission of their vote
    const {
        mutate: voteMutate,
        error: voteError,
        isPending: voteIsPending,
    } = useMutation({
        mutationFn: (vote: Vote) => pollsService.votePoll(pollId!, vote),
        onSuccess: viewResults,
    });
    const submitVote = useCallback(() => {
        voteMutate({ option_ids: selectedOptionIds });
    }, [selectedOptionIds, voteMutate]);

    // Let the user know that they've already voted if that's the error we
    // receive so they don't needlessly retry
    let isAlreadyVotedModalVisible = false;
    if (
        isAppError(voteError) &&
        voteError.error_code === ErrorCode.VoteUserAlreadyVoted
    ) {
        isAlreadyVotedModalVisible = true;
    } else {
        // If this isn't a known error, handle it as a page error
        error ||= voteError;
    }

    let hero: ReactNode;
    let body: ReactNode;
    if (pollLoading) {
        hero = <HeroSkeletonComponent />;
        body = <OptionsSkeletonComponent />;
    } else if (error) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={error as any} />;
    } else {
        hero = (
            <HeroComponent title={poll!.name} subtitle={poll!.description} />
        );
        body = (
            <>
                <OptionsComponent
                    options={options!}
                    selectedOptionIds={selectedOptionIds}
                    onClickOption={onClickOption}
                />
                {selectedOptionIds.length > 0 && (
                    <button
                        className={`button is-white has-text-primary is-fullwidth ${
                            voteIsPending && "is-loading"
                        }`}
                        onClick={submitVote}
                        disabled={voteIsPending}
                    >
                        Vote
                    </button>
                )}
                {isAlreadyVotedModalVisible && (
                    <AlreadyVotedModal viewResults={viewResults} />
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

export default PollPage;
