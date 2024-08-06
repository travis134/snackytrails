import { D1Database } from "@cloudflare/workers-types";

import { AppError, ErrorCode } from "@shared/errors";
import {
    Option,
    OptionCreate,
    OptionUpdate,
    PaginatedPolls,
    Poll,
    PollCreate,
    PollUpdate,
    Tally,
    Vote,
    isOption,
    isPoll,
    isTally,
} from "@shared/types";
import { PollsService } from "functions/types";

export class D1PollsService implements PollsService {
    pollsDb: D1Database;

    constructor({ pollsDb }: { pollsDb: D1Database }) {
        this.pollsDb = pollsDb;
    }

    async createPoll(pollCreate: PollCreate): Promise<string> {
        const { id, name, description, selections } = pollCreate;
        const createPoll = `INSERT INTO polls (id, name, description, selections) VALUES (?, ?, ?, ?)`;
        await this.pollsDb
            .prepare(createPoll)
            .bind(id, name, description, selections)
            .run();

        return id;
    }

    async readPoll(pollId: string): Promise<Poll> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId)
            .first<Poll>();
        if (!poll) {
            throw new AppError("Poll not found", ErrorCode.PollNotFound);
        }
        if (!isPoll(poll)) {
            throw new Error(`Invalid poll: ${JSON.stringify(poll)}`);
        }

        return poll;
    }

    async listPolls(limit: number, offset: number): Promise<PaginatedPolls> {
        const maxLimit = 10;
        limit = Math.min(limit, maxLimit);

        const listPolls = `
            SELECT * FROM polls 
            WHERE ended IS NULL OR ended > datetime('now')
            ORDER BY created DESC
            LIMIT ? OFFSET ?
        `;
        const { results: polls } = await this.pollsDb
            .prepare(listPolls)
            .bind(limit, offset)
            .all<Poll>();
        for (const poll of polls) {
            if (!isPoll(poll)) {
                throw new AppError("Invalid poll", ErrorCode.PollInvalid);
            }
        }

        const totalPollsQuery = `
            SELECT COUNT(*) as total FROM polls 
            WHERE ended IS NULL OR ended > datetime('now')
        `;
        const totalPolls = await this.pollsDb
            .prepare(totalPollsQuery)
            .first<number>("total");
        const more = offset + limit < totalPolls;

        return { polls, more };
    }

    async updatePoll(pollId: string, pollUpdate: PollUpdate): Promise<void> {
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
        if (ended || ended === null) {
            fields.push("ended = ?");
            values.push(ended);
        }

        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId)
            .first<Poll>();
        if (!poll) {
            throw new AppError("Poll not found", ErrorCode.PollNotFound);
        }

        const updatePoll = `UPDATE polls SET ${fields.join(", ")} WHERE id = ?`;
        await this.pollsDb
            .prepare(updatePoll)
            .bind(...values, pollId)
            .run();
    }

    async deletePoll(pollId: string): Promise<void> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId)
            .first<Poll>();
        if (!poll) {
            throw new AppError("Poll not found", ErrorCode.PollNotFound);
        }

        const deletePoll = `DELETE FROM polls WHERE id = ?`;
        await this.pollsDb.prepare(deletePoll).bind(pollId).run();
    }

    async tallyPoll(pollId: string): Promise<Tally[]> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId)
            .first<Poll>();
        if (!poll) {
            throw new AppError("Poll not found", ErrorCode.PollNotFound);
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
            .all<Tally>();
        for (const tally of tallies) {
            if (!isTally(tally)) {
                throw new AppError("Invalid tally", ErrorCode.TallyInvalid);
            }
        }

        return tallies;
    }

    async votePoll(pollId: string, user: string, vote: Vote): Promise<void> {
        const { option_ids: optionIds } = vote;

        // Validate input
        if (optionIds.length === 0) {
            throw new AppError(
                "You didn't select any options for this poll",
                ErrorCode.VoteNoOptions
            );
        }

        // Validate poll exists and hasn't ended
        const getPoll = `SELECT * FROM polls WHERE id = ? AND ended IS NULL OR ended > datetime('now')`;
        const poll = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId)
            .first<Poll>();
        if (!poll) {
            throw new AppError("Poll not found", ErrorCode.PollNotFound);
        }
        if (!isPoll(poll)) {
            throw new AppError(`Invalid poll: ${poll}`, ErrorCode.PollInvalid);
        }

        // Validate selection mode
        if (poll.selections === "single" && optionIds.length > 1) {
            throw new AppError(
                "You selected too many options selected for this poll",
                ErrorCode.VoteTooManyOptions
            );
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
            throw new AppError(
                "You selected invalid options selected for this poll",
                ErrorCode.VoteInvalidOptions
            );
        }

        // Validate user not already voted
        const checkVoted = `SELECT id FROM responses WHERE poll_id = ? AND user = ?`;
        const votedResults = await this.pollsDb
            .prepare(checkVoted)
            .bind(pollId, user)
            .first();
        if (votedResults) {
            throw new AppError(
                "Your vote has already been recorded",
                ErrorCode.VoteUserAlreadyVoted
            );
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

    async createOption(pollId: string, option: OptionCreate): Promise<number> {
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
            .first<Option>();
        if (!option) {
            throw new AppError("Option not found", ErrorCode.OptionNotFound);
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
            .all<Option>();
        for (const option of options) {
            if (!isOption(option)) {
                throw new Error(`Invalid option: ${JSON.stringify(option)}`);
            }
        }

        return options;
    }

    async updateOption(
        pollId: string,
        optionId: number,
        optionUpdate: OptionUpdate
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

        const getPoll = `SELECT * FROM options WHERE poll_id = ? AND id = ?`;
        const poll = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId, optionId)
            .first<Poll>();
        if (!poll) {
            throw new AppError("Option not found", ErrorCode.OptionNotFound);
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
            throw new AppError("Option not found", ErrorCode.OptionNotFound);
        }

        const deleteOption = `DELETE FROM options WHERE poll_id = ? AND id = ?`;
        await this.pollsDb.prepare(deleteOption).bind(pollId, optionId).run();
    }
}
