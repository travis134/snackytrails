import type { D1Database } from "@cloudflare/workers-types";

export interface Env {
    API_KEY: string;
    POLLS_DB: D1Database;
    pollsService: PollsService;
    user: string;
}

export type CreatePollResult = string;
export type ReadPollResult =
    | { found: true; poll: Poll }
    | { found: false; poll: null };
export type ListPollsResult = { polls: Poll[] };
export type UpdatePollResult =
    | { valid: false; found: null }
    | { valid: true; found: false }
    | { valid: true; found: true };
export type DeletePollResult = { found: boolean };

export type CreateOptionResult = number;
export type ReadOptionResult =
    | { found: true; option: Option }
    | { found: false; option: null };
export type ListOptionsResult = { options: Option[] };
export type UpdateOptionResult =
    | { valid: false; found: null }
    | { valid: true; found: false }
    | { valid: true; found: true };
export type DeleteOptionResult = { found: boolean };

export type TallyPollResult =
    | { found: true; tallies: Tally[] }
    | { found: false; tallies: null };

export type VotePollResult =
    | { valid: false; found: null; legal: null }
    | { valid: false; found: true; legal: null }
    | { valid: true; found: false; legal: null }
    | { valid: true; found: true; legal: true }
    | { valid: true; found: true; legal: false };

export interface PollsService {
    createPoll(poll: Poll): Promise<CreatePollResult>;
    readPoll(pollId: string): Promise<ReadPollResult>;
    listPolls(): Promise<ListPollsResult>;
    updatePoll(
        pollId: string,
        pollUpdate: Partial<Poll>
    ): Promise<UpdatePollResult>;
    deletePoll(pollId: string): Promise<DeletePollResult>;
    tallyPoll(pollId: string): Promise<TallyPollResult>;
    votePoll(
        pollId: string,
        user: string,
        optionIds: number[]
    ): Promise<VotePollResult>;

    createOption(pollId: string, option: Option): Promise<CreateOptionResult>;
    readOption(pollId: string, optionId: number): Promise<ReadOptionResult>;
    listOptions(pollId: string): Promise<ListOptionsResult>;
    updateOption(
        pollId: string,
        optionId: number,
        optionUpdate: Partial<Option>
    ): Promise<UpdateOptionResult>;
    deleteOption(pollId: string, optionId: number): Promise<DeleteOptionResult>;
}

export interface Poll {
    id: string;
    name: string;
    description: string;
    selections: "single" | "multiple";
    created?: string;
    ended?: string;
}

export const isPoll = (obj: any): obj is Poll => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.description === "string" &&
        (obj.selections === "single" || obj.selections === "multiple") &&
        (typeof obj.created === "undefined" ||
            typeof obj.created === "string") &&
        (typeof obj.ended === "undefined" ||
            obj.ended === null ||
            typeof obj.ended === "string")
    );
};

export interface Option {
    id?: number;
    poll_id?: string;
    text: string;
    image?: string;
}

export const isOption = (obj: any): obj is Option => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.id === "undefined" || typeof obj.id === "number") &&
        (typeof obj.poll_id === "undefined" ||
            typeof obj.poll_id === "string") &&
        typeof obj.text === "string" &&
        (typeof obj.image === "undefined" ||
            obj.image === null ||
            typeof obj.image === "string")
    );
};

export interface Response {
    id?: number;
    user: string;
    poll_id: string;
}

export const isResponse = (obj: any): obj is Response => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.id === "undefined" || typeof obj.id === "number") &&
        typeof obj.user === "string" &&
        typeof obj.poll_id === "string"
    );
};

export interface ResponseOption {
    response_id: number;
    option_id: number;
}

export const isResponseOption = (obj: any): obj is ResponseOption => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.response_id === "number" &&
        typeof obj.option_id === "number"
    );
};

export interface Tally {
    poll_id: string;
    option_id: number;
    responses: number;
}

export const isTally = (obj: any): obj is Tally => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.poll_id === "string" &&
        typeof obj.option_id === "number" &&
        typeof obj.responses === "number"
    );
};
