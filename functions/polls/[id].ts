import { Env, Poll } from "../lib/types";

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
