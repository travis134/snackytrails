import { BadRequest } from "@shared/errors";
import { Env, isPoll } from "@shared/types";

// Create a new poll
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const poll = await context.request.json();

    if (!isPoll(poll)) {
        throw new BadRequest();
    }

    const { name, description, selections } = poll;
    const createPoll = `INSERT INTO polls (name, description, selections) VALUES (?, ?, ?)`;
    const result = await POLLS_DB.prepare(createPoll)
        .bind(name, description, selections)
        .run();
    const id = result.meta.last_row_id;

    return Response.json({ id });
};
