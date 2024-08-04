import { Option, Poll, Tally, isOption, isPoll, isTally } from "@shared/types";
import { PollsService } from "@types";

export class APIPollsService implements PollsService {
    apiBaseUrl: string;

    constructor({ apiBaseUrl: apiBaseUrl }: { apiBaseUrl: string }) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async readPoll(pollId: string): Promise<Poll> {
        const url = new URL(`/api/polls/${pollId}`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { poll } = await response.json();
        if (!isPoll(poll)) {
            throw new Error(`Invalid poll: ${JSON.stringify(poll)}`);
        }

        return poll;
    }

    async listPolls(): Promise<Poll[]> {
        const url = new URL(`/api/polls`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { polls } = await response.json();
        for (const poll of polls) {
            if (!isPoll(poll)) {
                throw new Error(`Invalid poll: ${JSON.stringify(poll)}`);
            }
        }

        return polls;
    }

    async tallyPoll(pollId: string): Promise<Tally[]> {
        const url = new URL(`/api/polls/${pollId}/tally`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { tallies } = await response.json();
        for (const tally of tallies) {
            if (!isTally(tally)) {
                throw new Error(`Invalid option: ${JSON.stringify(tally)}`);
            }
        }

        return tallies as unknown as Tally[];
    }

    async votePoll(pollId: string, optionIds: number[]): Promise<void> {
        const url = new URL(`/api/polls/${pollId}/vote`, this.apiBaseUrl);
        for (const optionId of optionIds) {
            url.searchParams.append("option", optionId.toString());
        }

        await fetch(url, { method: "get" });
    }

    async readOption(pollId: string, optionId: number): Promise<Option> {
        const url = new URL(
            `/api/polls/${pollId}/options/${optionId}`,
            this.apiBaseUrl
        );
        const response = await fetch(url, { method: "get" });
        const { option } = await response.json();
        if (!isOption(option)) {
            throw new Error(`Invalid option: ${JSON.stringify(option)}`);
        }

        return option;
    }

    async listOptions(pollId: string): Promise<Option[]> {
        const url = new URL(`/api/polls/${pollId}/options`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { options } = await response.json();
        for (const option of options) {
            if (!isOption(option)) {
                throw new Error(`Invalid option: ${JSON.stringify(option)}`);
            }
        }

        return options;
    }
}
