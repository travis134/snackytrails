import { Env, Option } from "../../../lib/types";

// Update an option
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id } = context.params;
    const option: Partial<Option> = await context.request.json();
    const { text, image } = option;

    const fields: string[] = [];
    const values: any[] = [];

    if (text) {
        fields.push('text = ?');
        values.push(text);
    }

    fields.push('image = ?');
    values.push(image || null);

    if (fields.length === 0) {
        return new Response('No valid fields to update', { status: 400 });
    }

    values.push(id);

    const updateOption = `UPDATE options SET ${fields.join(', ')} WHERE id = ?`;

    try {
        await POLLS_DB.prepare(updateOption).bind(...values).run();
        return new Response('Option updated successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error updating option: ${error.message}`, { status: 500 });
    }
}

// Delete an option
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id } = context.params;

    const deleteOption = `DELETE FROM options WHERE id = ?`;

    try {
        await POLLS_DB.prepare(deleteOption).bind(id).run();
        return new Response('Option deleted successfully', { status: 200 });
    } catch (error) {
        return new Response(`Error deleting option: ${error.message}`, { status: 500 });
    }
}
