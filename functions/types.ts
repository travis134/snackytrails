import type { D1Database } from "@cloudflare/workers-types";
import { R2Bucket } from "@cloudflare/workers-types";

import {
    Option,
    OptionCreate,
    OptionUpdate,
    Poll,
    PollCreate,
    PollUpdate,
    Tally,
    Vote,
} from "@shared/types";

export interface Env {
    API_KEY: string;
    ORIGIN: string;
    POLLS_DB: D1Database;
    IMAGES_BUCKET: R2Bucket;
    pollsService: PollsService;
    imagesService: ImagesService;
    user: string;
}

export interface PollsService {
    createPoll(poll: PollCreate): Promise<string>;
    readPoll(pollId: string): Promise<Poll>;
    listPolls(): Promise<Poll[]>;
    updatePoll(pollId: string, pollUpdate: PollUpdate): Promise<void>;
    deletePoll(pollId: string): Promise<void>;
    tallyPoll(pollId: string): Promise<Tally[]>;
    votePoll(pollId: string, user: string, vote: Vote): Promise<void>;

    createOption(pollId: string, option: OptionCreate): Promise<number>;
    readOption(pollId: string, optionId: number): Promise<Option>;
    listOptions(pollId: string): Promise<Option[]>;
    updateOption(
        pollId: string,
        optionId: number,
        optionUpdate: OptionUpdate
    ): Promise<void>;
    deleteOption(pollId: string, optionId: number): Promise<void>;
}

export interface ImagesService {
    uploadImage(key: string, data: ReadableStream): Promise<void>;
    deleteImage(key: string): Promise<void>;
}
