import { Env, Option } from "@shared/types";

// Create a new option
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId } = context.params;
    const option: Partial<Option> = await context.request.json();
    const { text, image } = option;

    if (!text) {
        return new Response('Invalid input', { status: 400 });
    }

    const createOption = `INSERT INTO options (poll_id, text, image) VALUES (?, ?, ?)`;

    try {
        const result = await POLLS_DB.prepare(createOption).bind(pollId, text, image || null).run();
        const id = result.meta.last_row_id;
        return new Response(JSON.stringify({ id: id }), { status: 201 });
    } catch (error) {
        return new Response(`Error creating poll: ${error.message}`, { status: 500 });
    }
}
