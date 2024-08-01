import { Option, Poll, Tally } from "@shared/types";

export interface PollsService {
    readPoll(pollId: string): Promise<Poll>;
    listPolls(): Promise<Poll[]>;
    tallyPoll(pollId: string): Promise<Tally[]>;
    votePoll(pollId: string, optionIds: number[]): Promise<void>;

    readOption(pollId: string, optionId: number): Promise<Option>;
    listOptions(pollId: string): Promise<Option[]>;
}
