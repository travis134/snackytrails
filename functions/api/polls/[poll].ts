import { Env } from "@shared/types";

// Read a poll
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const { poll: pollId } = context.params;

    const getPoll = `SELECT * FROM polls WHERE id = ?`;
    const getOptionsWithResponses = `
        SELECT options.id, options.text, options.image, COUNT(response_options.response_id) as responses
        FROM options
        LEFT JOIN response_options ON options.id = response_options.option_id
        WHERE options.poll_id = ?
        GROUP BY options.id
    `;

    try {
        const poll = await POLLS_DB.prepare(getPoll).bind(pollId).first();
        if (!poll) {
            return new Response('Poll not found', { status: 404 });
        }
        const optionsResult = await POLLS_DB.prepare(getOptionsWithResponses).bind(pollId).all();
        const options = optionsResult.results.map((option: any) => ({
            id: option.id,
            text: option.text,
            image: option.image,
            responses: option.responses
        }));
        return new Response(JSON.stringify({ poll, options }), { status: 200 });
    } catch (error) {
        return new Response(`Error reading poll: ${error.message}`, { status: 500 });
    }
}
