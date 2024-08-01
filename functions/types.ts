import type { D1Database } from "@cloudflare/workers-types";
import { Option, Poll, Tally } from "@shared/types";

export interface Env {
    API_KEY: string;
    POLLS_DB: D1Database;
    pollsService: PollsService;
    user: string;
}

export interface PollsService {
    createPoll(poll: Poll): Promise<string>;
    readPoll(pollId: string): Promise<Poll>;
    listPolls(): Promise<Poll[]>;
    updatePoll(pollId: string, pollUpdate: Partial<Poll>): Promise<void>;
    deletePoll(pollId: string): Promise<void>;
    tallyPoll(pollId: string): Promise<Tally[]>;
    votePoll(pollId: string, user: string, optionIds: number[]): Promise<void>;

    createOption(pollId: string, option: Option): Promise<number>;
    readOption(pollId: string, optionId: number): Promise<Option>;
    listOptions(pollId: string): Promise<Option[]>;
    updateOption(
        pollId: string,
        optionId: number,
        optionUpdate: Partial<Option>
    ): Promise<void>;
    deleteOption(pollId: string, optionId: number): Promise<void>;
}
