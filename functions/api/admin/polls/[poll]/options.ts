import { Env, isOption } from "@shared/types";
import { BadRequest } from "@shared/errors";

// Create a new option
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId } = context.params;
    const option = await context.request.json();

    if (!isOption(option)) {
        throw new BadRequest();
    }

    const { text, image } = option;
    const createOption = `INSERT INTO options (poll_id, text, image) VALUES (?, ?, ?)`;
    const result = await POLLS_DB.prepare(createOption)
        .bind(pollId, text, image || null)
        .run();
    const id = result.meta.last_row_id;

    return Response.json({ id });
};
