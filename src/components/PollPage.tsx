import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorCode, isAppError } from "@shared/errors";
import { Poll, Option, Vote } from "@shared/types";
import Routes from "@lib/routes";
import { PollsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";
import ErrorComponent from "@components/ErrorComponent";
import OptionComponent from "@components/OptionComponent";

interface PollPageProps {
    pollsService: PollsService;
}

const PollPage: React.FC<PollPageProps> = ({ pollsService }) => {
    const navigate = useNavigate();
    const { id: pollId } = useParams<{ id: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
    const [alreadyVotedErrorVisible, setAlreadyVotedErrorVisible] =
        useState<boolean>(false);
    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();

    const onClickOption = async (clickedOption: Option) => {
        const alreadySelected = selectedOptionIds.includes(clickedOption.id);

        // Toggle the selected option.
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

    const seeResults = useCallback(() => {
        navigate(Routes.PollResultsRoute.href({ id: poll!.id }));
    }, [navigate, poll]);

    const doVote = useCallback(async () => {
        setIsVoting(true);

        try {
            const vote: Vote = { option_ids: selectedOptionIds };
            await pollsService.votePoll(poll!.id, vote);
            seeResults();
        } catch (error) {
            const alreadyVotedError =
                isAppError(error) &&
                error.error_code === ErrorCode.VoteUserAlreadyVoted;

            if (alreadyVotedError) {
                setAlreadyVotedErrorVisible(true);
                return;
            }

            throw error;
        }
    }, [pollsService, poll, selectedOptionIds, seeResults]);

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

    const alreadyVotedModal = (
        <div className={`modal ${alreadyVotedErrorVisible && "is-active"}`}>
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
                            onClick={() => seeResults()}
                        >
                            See results
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );

    let body: ReactNode;
    if (isLoading) {
        body = <LoadingComponent />;
    } else if (error) {
        body = <ErrorComponent error={error} />;
    } else if (poll) {
        body = (
            <>
                <div className="fixed-grid has-1-cols-mobile has-1-cols-tablet has-2-cols-desktop mb-5">
                    <div className="grid">
                        {options.map((option) => (
                            <div className="cell" key={option.id}>
                                <OptionComponent
                                    option={option}
                                    isSelected={selectedOptionIds.includes(
                                        option.id
                                    )}
                                    onClick={onClickOption}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {selectedOptionIds.length > 0 && (
                    <button
                        className={`button is-white has-text-primary is-fullwidth ${
                            isVoting && "is-loading"
                        }`}
                        onClick={() => doVote()}
                        disabled={isVoting}
                    >
                        Vote
                    </button>
                )}
                {alreadyVotedModal}
            </>
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
