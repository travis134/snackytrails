import { Env, Poll } from "../../lib/types";

// Read a poll
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id } = context.params;

    const getPoll = "SELECT * FROM polls WHERE id = ?";

    try {
        const poll = await POLLS_DB.prepare(getPoll).bind(id).first();
        if (!poll) {
            return new Response('Poll not found', { status: 404 });
        }
        return new Response(JSON.stringify(poll), { status: 200 });
    } catch (error) {
        return new Response(`Error reading poll: ${error.message}`, { status: 500 });
    }
}

// Update a poll
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id } = context.params;
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

    values.push(id);

    const updatePoll = `UPDATE polls SET ${fields.join(', ')} WHERE id = ?`;

    try {
        await POLLS_DB.prepare(updatePoll).bind(name, description, selections, ended, id).run();
        return new Response('Poll updated successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error updating poll: ${error.message}`, { status: 500 });
    }
}

// Delete a poll
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id } = context.params;

    const deletePoll = "DELETE FROM polls WHERE id = ?";

    try {
        await POLLS_DB.prepare(deletePoll).bind(id).run();
        return new Response('Poll deleted successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error deleting poll: ${error.message}`, { status: 500 });
    }
}
