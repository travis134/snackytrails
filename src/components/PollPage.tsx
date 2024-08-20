import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorCode, isAppError } from "@shared/errors";
import { Poll, Option, Vote } from "@shared/types";
import Routes from "@lib/routes";
import { PollsService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import OptionsComponent from "@components/OptionsComponent";
import OptionsSkeletonComponent from "@components/OptionsSkeletonComponent";

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

    // Handle toggling selected options
    const onClickOption = async (clickedOption: Option) => {
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

    // Navigate to the poll results page
    const seeResults = useCallback(() => {
        navigate(Routes.PollResultsRoute.href({ id: poll!.id }));
    }, [navigate, poll]);

    // Handle user submission of their vote
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

    // Load page data
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

    let title: string;
    let subtitle: string;
    let body: ReactNode;
    if (isLoading) {
        title = "Loading";
        subtitle = "Hold your horses while we load this awesome poll";
        body = <OptionsSkeletonComponent />;
    } else if (error) {
        title = "Uh oh, partner!";
        subtitle =
            "Looks like this poll got lost on the trail. How about a quick refresh to see if it finds its way?";
        body = <ErrorComponent error={error} />;
    } else {
        title = poll!.name;
        subtitle = poll!.description;
        body = (
            <>
                <OptionsComponent
                    options={options}
                    selectedOptionIds={selectedOptionIds}
                    onClickOption={onClickOption}
                />
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
            <section className="hero">
                <div className="hero-body">
                    <p className="title">{title}</p>
                    <p className="subtitle">{subtitle}</p>
                </div>
            </section>

            <section className="section">{body}</section>
        </>
    );
};

export default PollPage;
