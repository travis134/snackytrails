import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Poll, Option } from "@shared/types";
import { PollsService } from "@types";

import LoadingComponent from "@components/LoadingComponent";

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
    } else {
        body = (
            <div className="card column is-one-third is-touch">
                <header className="card-header">
                    <p className="card-header-title">{poll!.name}</p>
                </header>
                <div className="card-content">
                    <div className="content">
                        <p>{poll!.description}</p>
                        <p>
                            <strong>Selection Type:</strong> {poll!.selections}
                        </p>
                        <p>
                            <strong>Created:</strong>{" "}
                            {new Date(poll!.created).toLocaleDateString()}
                        </p>
                        {poll!.ended && (
                            <p>
                                <strong>Ended:</strong>{" "}
                                {new Date(poll!.ended).toLocaleDateString()}
                            </p>
                        )}
                        <div className="options">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className="box is-clickable"
                                >
                                    {option.image && (
                                        <figure className="image is-128x128">
                                            <img
                                                src={option.image}
                                                alt={option.text}
                                            />
                                        </figure>
                                    )}
                                    <p>{option.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <section>{body}</section>
        </>
    );
};

export default PollPage;
