import { Env, Poll } from "../../lib/types";

// Update a poll
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id: pollId } = context.params;
    const poll: Partial<Poll> = await context.request.json();
    const { name, description, selections, ended } = poll;

    const fields: string[] = [];
    const values: any[] = [];

    if (name) {
        fields.push('name = ?');
        values.push(name);
    }

    if (description) {
        fields.push('description = ?');
        values.push(description);
    }

    if (selections) {
        fields.push('selections = ?');
        values.push(selections);
    }

    if (ended) {
        fields.push('ended = ?');
        values.push(ended);
    }

    if (fields.length === 0) {
        return new Response('No valid fields to update', { status: 400 });
    }

    values.push(pollId);

    const updatePoll = `UPDATE polls SET ${fields.join(', ')} WHERE id = ?`;

    try {
        await POLLS_DB.prepare(updatePoll).bind(...values).run();
        return new Response('Poll updated successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error updating poll: ${error.message}`, { status: 500 });
    }
}

// Delete a poll
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id } = context.params;

    const deletePoll = `DELETE FROM polls WHERE id = ?`;

    try {
        await POLLS_DB.prepare(deletePoll).bind(id).run();
        return new Response('Poll deleted successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error deleting poll: ${error.message}`, { status: 500 });
    }
}
