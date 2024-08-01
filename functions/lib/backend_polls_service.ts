import {
    CreateOptionResult,
    CreatePollResult,
    DeleteOptionResult,
    DeletePollResult,
    Option,
    Poll,
    PollsService as PollsService,
    ReadOptionResult,
    ReadPollResult,
    UpdateOptionResult,
    UpdatePollResult,
    isOption,
    isPoll,
} from "@shared/types";

export class BackendPollsService implements PollsService {
    pollsDb: D1Database;

    constructor({ pollsDb }: { pollsDb: D1Database }) {
        this.pollsDb = pollsDb;
    }

    async createPoll(poll: Poll): Promise<CreatePollResult> {
        const { id, name, description, selections } = poll;
        const createPoll = `INSERT INTO polls (id, name, description, selections) VALUES (?, ?, ?, ?)`;
        const result = await this.pollsDb
            .prepare(createPoll)
            .bind(id, name, description, selections)
            .run();

        return id;
    }

    async readPoll(pollId: string): Promise<ReadPollResult> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            return { found: false, poll: null };
        }
        if (!isPoll(poll)) {
            throw new Error("Invalid poll");
        }

        return { found: true, poll };
    }

    async updatePoll(
        pollId: string,
        pollUpdate: Partial<Poll>
    ): Promise<UpdatePollResult> {
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
            return { valid: false, found: null };
        }

        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            return { valid: true, found: false };
        }

        const updatePoll = `UPDATE polls SET ${fields.join(", ")} WHERE id = ?`;
        await this.pollsDb
            .prepare(updatePoll)
            .bind(...values, pollId)
            .run();

        return { valid: true, found: true };
    }

    async deletePoll(pollId: string): Promise<DeletePollResult> {
        const getPoll = `SELECT * FROM polls WHERE id = ?`;
        const poll = await this.pollsDb.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            return { found: false };
        }

        const deletePoll = `DELETE FROM polls WHERE id = ?`;
        await this.pollsDb.prepare(deletePoll).bind(pollId).run();

        return { found: true };
    }

    async createOption(
        pollId: string,
        option: Option
    ): Promise<CreateOptionResult> {
        const { text, image } = option;
        const createOption = `INSERT INTO options (poll_id, text, image) VALUES (?, ?, ?)`;
        const result = await this.pollsDb
            .prepare(createOption)
            .bind(pollId, text, image || null)
            .run();
        const id = result.meta.last_row_id;

        return id;
    }

    async readOption(
        pollId: string,
        optionId: number
    ): Promise<ReadOptionResult> {
        const getPoll = `SELECT * FROM options WHERE poll_id = ? AND id = ?`;
        const option = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId, optionId)
            .first();
        if (!option) {
            return { found: false, option: null };
        }
        if (!isOption(option)) {
            throw new Error("Invalid option");
        }

        return { found: true, option };
    }

    async updateOption(
        pollId: string,
        optionId: number,
        optionUpdate: Partial<Option>
    ): Promise<UpdateOptionResult> {
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
            return { valid: false, found: null };
        }

        const getPoll = `SELECT * FROM options WHERE poll_id = ? AND id = ?`;
        const option = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId, optionId)
            .first();
        if (!option) {
            return { valid: true, found: false };
        }

        const updateOption = `UPDATE options SET ${fields.join(
            ", "
        )} WHERE poll_id = ? AND id = ?`;
        await this.pollsDb
            .prepare(updateOption)
            .bind(...values, pollId, optionId)
            .run();

        return { valid: true, found: true };
    }

    async deleteOption(
        pollId: string,
        optionId: number
    ): Promise<DeleteOptionResult> {
        const getPoll = `SELECT * FROM options WHERE poll_id = ? AND id = ?`;
        const option = await this.pollsDb
            .prepare(getPoll)
            .bind(pollId, optionId)
            .first();
        if (!option) {
            return { found: false };
        }

        const deleteOption = `DELETE FROM options WHERE poll_id = ? AND id = ?`;
        await this.pollsDb.prepare(deleteOption).bind(pollId, optionId).run();

        return { found: true };
    }
}
