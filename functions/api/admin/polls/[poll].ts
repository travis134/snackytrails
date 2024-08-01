import { BadRequest } from "@shared/errors";
import { Env, Poll } from "@shared/types";

// Update a poll
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId } = context.params;
    const poll: Partial<Poll> = await context.request.json();

    const { name, description, selections, ended } = poll;
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
        throw new BadRequest();
    }

    const updatePoll = `UPDATE polls SET ${fields.join(", ")} WHERE id = ?`;
    await POLLS_DB.prepare(updatePoll)
        .bind(...values, pollId)
        .run();

    return new Response();
};

// Delete a poll
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId } = context.params;

    const deletePoll = `DELETE FROM polls WHERE id = ?`;
    await POLLS_DB.prepare(deletePoll).bind(pollId).run();

    return new Response();
};
