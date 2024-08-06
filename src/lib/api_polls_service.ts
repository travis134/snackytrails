import { AppError, ErrorCode } from "@shared/errors";
import {
    Option,
    PaginatedPolls,
    Poll,
    Tally,
    Vote,
    isOption,
    isPoll,
    isTally,
    isVote,
} from "@shared/types";
import { PollsService } from "@types";

export class APIPollsService implements PollsService {
    apiBaseUrl: string;

    constructor({ apiBaseUrl }: { apiBaseUrl: string }) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async readPoll(pollId: string): Promise<Poll> {
        const url = new URL(`/api/polls/${pollId}`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { poll } = await response.json();
        if (!isPoll(poll)) {
            throw new AppError(
                `Invalid poll: ${JSON.stringify(poll)}`,
                ErrorCode.PollInvalid
            );
        }

        return poll;
    }

    async listPolls(limit: number, offset: number): Promise<PaginatedPolls> {
        const url = new URL(`/api/polls`, this.apiBaseUrl);
        url.searchParams.append("limit", limit.toString(10));
        url.searchParams.append("offset", offset.toString(10));
        const response = await fetch(url, { method: "get" });
        const { polls, more } = await response.json();
        for (const poll of polls) {
            if (!isPoll(poll)) {
                throw new AppError(
                    `Invalid poll: ${JSON.stringify(poll)}`,
                    ErrorCode.PollInvalid
                );
            }
        }

        return { polls, more };
    }

    async tallyPoll(pollId: string): Promise<Tally[]> {
        const url = new URL(`/api/polls/${pollId}/tally`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { tallies } = await response.json();
        for (const tally of tallies) {
            if (!isTally(tally)) {
                throw new AppError(
                    `Invalid tally: ${JSON.stringify(tally)}`,
                    ErrorCode.TallyInvalid
                );
            }
        }

        return tallies as unknown as Tally[];
    }

    async votePoll(pollId: string, vote: Vote): Promise<void> {
        const url = new URL(`/api/polls/${pollId}/vote`, this.apiBaseUrl);
        if (!isVote(vote)) {
            throw new AppError(
                `Invalid vote: ${JSON.stringify(vote)}`,
                ErrorCode.VoteInvalid
            );
        }

        await fetch(url, { method: "post", body: JSON.stringify(vote) });
    }

    async readOption(pollId: string, optionId: number): Promise<Option> {
        const url = new URL(
            `/api/polls/${pollId}/options/${optionId}`,
            this.apiBaseUrl
        );
        const response = await fetch(url, { method: "get" });
        const { option } = await response.json();
        if (!isOption(option)) {
            throw new AppError(
                `Invalid option: ${JSON.stringify(option)}`,
                ErrorCode.OptionInvalid
            );
        }

        return option;
    }

    async listOptions(pollId: string): Promise<Option[]> {
        const url = new URL(`/api/polls/${pollId}/options`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { options } = await response.json();
        for (const option of options) {
            if (!isOption(option)) {
                throw new AppError(
                    `Invalid option: ${JSON.stringify(option)}`,
                    ErrorCode.OptionInvalid
                );
            }
        }

        return options;
    }
}
