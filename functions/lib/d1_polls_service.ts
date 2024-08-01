import { BadRequestError, NotFoundError } from "@shared/errors";
import { Option, Poll, Tally, isOption, isPoll, isTally } from "@shared/types";
import { PollsService } from "functions/types";

export class D1PollsService implements PollsService {
    pollsDb: D1Database;

    constructor({ pollsDb }: { pollsDb: D1Database }) {
        this.pollsDb = pollsDb;
    }

    async createPoll(poll: Poll): Promise<string> {
        const { id, name, description, selections } = poll;
        const createPoll = `INSERT INTO polls (id, name, description, selections) VALUES (?, ?, ?, ?)`;
        await this.pollsDb
            .prepare(createPoll)
            .bind(id, name, description, selections)
            .run();

        return id;
    }

    async readPoll(pollId: string): Promise<Poll> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            throw new NotFoundError();
        }
        if (!isPoll(poll)) {
            throw new Error(`Invalid poll: ${JSON.stringify(poll)}`);
        }

        return poll;
    }

    async listPolls(): Promise<Poll[]> {
        const listPolls = `SELECT * FROM polls WHERE ended IS NULL OR ended > datetime('now')`;
        const { results: polls } = await this.pollsDb.prepare(listPolls).all();
        for (const poll of polls) {
            if (!isPoll(poll)) {
                throw new Error(`Invalid poll: ${JSON.stringify(poll)}`);
            }
        }

        return polls as unknown as Poll[];
    }

    async updatePoll(pollId: string, pollUpdate: Partial<Poll>): Promise<void> {
        const { name, description, selections, ended } = pollUpdate;
        const fields: string[] = [];
        const values: any[] = [];
        if (name) {
            fields.push("name = ?");
            values.push(name);
        }
        if (description) {
            fields.push("description = ?");
            values.push(description);
        }
        if (selections) {
            fields.push("selections = ?");
            values.push(selections);
        }
        if (ended) {
            fields.push("ended = ?");
            values.push(ended);
        }
        if (fields.length === 0) {
            throw new BadRequestError();
        }

        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            throw new NotFoundError();
        }

        const updatePoll = `UPDATE polls SET ${fields.join(", ")} WHERE id = ?`;
        await this.pollsDb
            .prepare(updatePoll)
            .bind(...values, pollId)
            .run();
    }

    async deletePoll(pollId: string): Promise<void> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            throw new NotFoundError();
        }

        const deletePoll = `DELETE FROM polls WHERE id = ?`;
        await this.pollsDb.prepare(deletePoll).bind(pollId).run();
    }

    async tallyPoll(pollId: string): Promise<Tally[]> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            throw new NotFoundError();
        }

        const getTallies = `
            SELECT options.poll_id as poll_id, options.id as option_id, COUNT(response_options.response_id) as responses
            FROM options
            LEFT JOIN response_options ON options.id = response_options.option_id
            WHERE options.poll_id = ?
            GROUP BY options.id
        `;

        const { results: tallies } = await this.pollsDb
            .prepare(getTallies)
            .bind(pollId)
            .all();
        for (const tally of tallies) {
            if (!isTally(tally)) {
                throw new Error(`Invalid option: ${JSON.stringify(tally)}`);
            }
        }

        return tallies as unknown as Tally[];
    }

    async votePoll(
        pollId: string,
        user: string,
        optionIds: number[]
    ): Promise<void> {
        // Validate input
        if (optionIds.length === 0) {
            throw new BadRequestError({
                errorCode: "no_options",
                message: "You didn't select any options for this poll",
            });
        }

        // Validate poll exists and hasn't ended
        const getPoll = `SELECT * FROM polls WHERE id = ? AND ended IS NULL OR ended > datetime('now')`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            throw new NotFoundError();
        }
        if (!isPoll(poll)) {
            throw new Error(`Invalid poll: ${JSON.stringify(poll)}`);
        }

        // Validate selection mode
        if (poll.selections === "single" && optionIds.length > 1) {
            throw new BadRequestError({
                errorCode: "too_many_options",
                message: "You selected too many options selected for this poll",
            });
        }

        // Validate selected options
        const validateOptions = `SELECT id FROM options WHERE poll_id = ? AND id IN (${optionIds
            .map(() => "?")
            .join(", ")})`;
        const validationResults = await this.pollsDb
            .prepare(validateOptions)
            .bind(pollId, ...optionIds)
            .all();
        if (validationResults.results.length !== optionIds.length) {
            throw new BadRequestError({
                errorCode: "invalid_options",
                message: "You selected invalid options selected for this poll",
            });
        }

        // Validate user not already voted
        const checkVoted = `SELECT id FROM responses WHERE poll_id = ? AND user = ?`;
        const votedResults = await this.pollsDb
            .prepare(checkVoted)
            .bind(pollId, user)
            .first();
        if (votedResults) {
            throw new BadRequestError({
                errorCode: "user_already_voted",
                message: "Your vote has already been recorded",
            });
        }

        const createResponse = `INSERT INTO responses (user, poll_id) VALUES (?, ?)`;
        const result = await this.pollsDb
            .prepare(createResponse)
            .bind(user, pollId)
            .run();
        const responseId = result.meta.last_row_id;

        for (const optionId of optionIds) {
            const createResponseOption = `INSERT INTO response_options (response_id, option_id) VALUES (?, ?)`;
            await this.pollsDb
                .prepare(createResponseOption)
                .bind(responseId, optionId)
                .run();
        }
    }

    async createOption(pollId: string, option: Option): Promise<number> {
        const { text, image } = option;
        const createOption = `INSERT INTO options (poll_id, text, image) VALUES (?, ?, ?)`;
        const result = await this.pollsDb
            .prepare(createOption)
            .bind(pollId, text, image || null)
            .run();
        const id = result.meta.last_row_id;

        return id;
    }

    async readOption(pollId: string, optionId: number): Promise<Option> {
        const getPoll = `SELECT * FROM options WHERE poll_id = ? AND id = ?`;
        const option = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId, optionId)
            .first();
        if (!option) {
            throw new NotFoundError();
        }
        if (!isOption(option)) {
            throw new Error(`Invalid option: ${JSON.stringify(option)}`);
        }

        return option;
    }

    async listOptions(pollId: string): Promise<Option[]> {
        const listOptions = `SELECT * FROM options WHERE poll_id = ?`;
        const { results: options } = await this.pollsDb
            .prepare(listOptions)
            .bind(pollId)
            .all();
        for (const option of options) {
            if (!isOption(option)) {
                throw new Error(`Invalid option: ${JSON.stringify(option)}`);
            }
        }

        return options as unknown as Option[];
    }

    async updateOption(
        pollId: string,
        optionId: number,
        optionUpdate: Partial<Option>
    ): Promise<void> {
        const { text, image } = optionUpdate;
        const fields: string[] = [];
        const values: any[] = [];
        if (text) {
            fields.push("text = ?");
            values.push(text);
        }
        if (image !== undefined) {
            fields.push("image = ?");
            values.push(image || null);
        }
        if (fields.length === 0) {
            throw new BadRequestError();
        }

        const getPoll = `SELECT * FROM options WHERE poll_id = ? AND id = ?`;
        const option = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId, optionId)
            .first();
        if (!option) {
            throw new NotFoundError();
        }

        const updateOption = `UPDATE options SET ${fields.join(
            ", "
        )} WHERE poll_id = ? AND id = ?`;
        await this.pollsDb
            .prepare(updateOption)
            .bind(...values, pollId, optionId)
            .run();
    }

    async deleteOption(pollId: string, optionId: number): Promise<void> {
        const getPoll = `SELECT * FROM options WHERE poll_id = ? AND id = ?`;
        const option = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId, optionId)
            .first();
        if (!option) {
            throw new NotFoundError();
        }

        const deleteOption = `DELETE FROM options WHERE poll_id = ? AND id = ?`;
        await this.pollsDb.prepare(deleteOption).bind(pollId, optionId).run();
    }
}
