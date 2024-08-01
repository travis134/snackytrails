import { APIError } from "@shared/errors";
import { Env, Option } from "@shared/types";

// Update an option
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId, option: optionId } = context.params;
    const option: Partial<Option> = await context.request.json();

    const { text, image } = option;
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
        throw new APIError("Invalid update request", 400);
    }

    const updateOption = `UPDATE options SET ${fields.join(
        ", "
    )} WHERE poll_id = ? AND id = ?`;
    await POLLS_DB.prepare(updateOption)
        .bind(...values, pollId, optionId)
        .run();

    return new Response();
};

// Delete an option
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId, option: optionId } = context.params;

    const deleteOption = `DELETE FROM options WHERE poll_id = ? AND id = ?`;
    await POLLS_DB.prepare(deleteOption).bind(pollId, optionId).run();

    return new Response();
};
