import { Option, Poll, Tally, Vote } from "@shared/types";

export interface PollsService {
    readPoll(pollId: string): Promise<Poll>;
    listPolls(): Promise<Poll[]>;
    tallyPoll(pollId: string): Promise<Tally[]>;
    votePoll(pollId: string, vote: Vote): Promise<void>;

    readOption(pollId: string, optionId: number): Promise<Option>;
    listOptions(pollId: string): Promise<Option[]>;
}
