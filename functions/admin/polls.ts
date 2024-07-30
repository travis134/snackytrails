import { Env, Poll } from "../lib/types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { POLLS_DB } = context.env;
    const poll: Partial<Poll> = await context.request.json();
    const { name, description, selections } = poll;

    if (!name || !selections) {
        return new Response('Invalid input', { status: 400 });
    }

    const createPoll = `
    INSERT INTO polls (name, description, selections)
    VALUES (?, ?, ?)
`;

    try {
        const result = await POLLS_DB.prepare(createPoll).bind(name, description, selections).run();
        return new Response(JSON.stringify({ result }), { status: 201 });
    } catch (error) {
        return new Response(`Error creating poll: ${error.message}`, { status: 500 });
    }
}
