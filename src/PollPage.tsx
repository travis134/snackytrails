import React, { useState, useEffect } from "react";
import { Poll, Option } from "@shared/types";
import { PollsService } from "@types";

const PollPage = ({
    pollId,
    pollService,
}: {
    pollId: string;
    pollService: PollsService;
}) => {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                const pollData = await pollService.readPoll(pollId);
                const optionData = await pollService.listOptions(pollId);
                setPoll(pollData);
                setOptions(optionData);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPollData();
    }, [pollId, pollService]);

    const handleVote = async () => {
        try {
            await pollService.votePoll(pollId, selectedOptions);
            alert("Vote submitted successfully!");
        } catch (error) {
            console.error("Error submitting vote:", error);
        }
    };

    const handleOptionChange = (optionId: number) => {
        if (poll?.selections === "single") {
            setSelectedOptions([optionId]);
        } else {
            setSelectedOptions((prev) =>
                prev.includes(optionId)
                    ? prev.filter((id) => id !== optionId)
                    : [...prev, optionId]
            );
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="box">
                <h1 className="title">{poll?.name}</h1>
                <p className="subtitle">{poll?.description}</p>
                <div className="content">
                    {options.map((option) => (
                        <div key={option.id} className="field">
                            <input
                                type={
                                    poll?.selections === "single"
                                        ? "radio"
                                        : "checkbox"
                                }
                                id={`option-${option.id}`}
                                name="options"
                                value={option.id}
                                checked={selectedOptions.includes(option.id!)}
                                onChange={() => handleOptionChange(option.id!)}
                            />
                            <label
                                htmlFor={`option-${option.id}`}
                                className="ml-2"
                            >
                                {option.text}
                            </label>
                        </div>
                    ))}
                </div>
                <button className="button is-primary" onClick={handleVote}>
                    Vote
                </button>
            </div>
        </div>
    );
};

export default PollPage;
