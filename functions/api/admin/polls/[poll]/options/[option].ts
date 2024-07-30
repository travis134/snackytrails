import { Env, Option } from "../../../../lib/types";

// Update an option
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId, option: optionId } = context.params;
    const option: Partial<Option> = await context.request.json();
    const { text, image } = option;

    const fields: string[] = [];
    const values: any[] = [];

    if (text) {
        fields.push('text = ?');
        values.push(text);
    }

    if (image !== undefined) {
        fields.push('image = ?');
        values.push(image || null);
    }

    if (fields.length === 0) {
        return new Response('No valid fields to update', { status: 400 });
    }

    const updateOption = `UPDATE options SET ${fields.join(', ')} WHERE poll_id = ? AND id = ?`;

    try {
        await POLLS_DB.prepare(updateOption).bind(...values, pollId, optionId).run();
        return new Response('Option updated successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error updating option: ${error.message}`, { status: 500 });
    }
}

// Delete an option
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId, option: optionId } = context.params;

    const deleteOption = `DELETE FROM options WHERE poll_id = ? AND id = ?`;

    try {
        await POLLS_DB.prepare(deleteOption).bind(pollId, optionId).run();
        return new Response('Option deleted successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error deleting option: ${error.message}`, { status: 500 });
    }
}
