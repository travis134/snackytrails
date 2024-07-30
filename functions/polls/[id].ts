import { Env, Poll, Option } from "../lib/types";

// Read a poll
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { id: pollId } = context.params;

    const getPoll = `SELECT * FROM polls WHERE id = ?`;
    const getOptions = `SELECT * FROM options WHERE poll_id = ?`;

    try {
        const poll = await POLLS_DB.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            return new Response('Poll not found', { status: 404 });
        }

        const { results: options } = await POLLS_DB.prepare(getOptions).bind(pollId).all();
        return new Response(JSON.stringify({ poll, options }), { status: 200 });
    } catch (error) {
        return new Response(`Error reading poll: ${error.message}`, { status: 500 });
    }
}
