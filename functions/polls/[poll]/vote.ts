import { Env, Option, ResponseOption } from "../../lib/types";

// Cast a vote
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const { POLLS_DB } = context.env;
    const { poll: pollId } = context.params;
    const url = new URL(request.url);
    const optionIds = url.searchParams.getAll('option');

    if (!pollId) {
        return new Response('Poll ID is required', { status: 400 });
    }

    if (optionIds.length === 0) {
        return new Response('At least one option ID is required', { status: 400 });
    }

    const user = await userFromRequest(request);

    const createResponse = `INSERT INTO responses (user, poll_id) VALUES (?, ?)`;
    const createResponseOption = `INSERT INTO response_options (response_id, option_id) VALUES (?, ?)`;
    const validateOptions = `SELECT id FROM options WHERE poll_id = ? AND id IN (${optionIds.map(() => '?').join(', ')})`;
    const checkSelections = `SELECT selections FROM polls WHERE id = ?`;

    try {
        const poll = await POLLS_DB.prepare(checkSelections).bind(pollId).first();

        // Validate exists
        if (!poll) {
            return new Response('Poll not found', { status: 404 });
        }

        // Validate not ended
        if (poll.ended && new Date(poll.ended as string) <= new Date()) {
            return new Response('Poll has ended', { status: 400 });
        }

        // Validate selection mode
        if (poll.selections === 'single' && optionIds.length > 1) {
            return new Response('Only one option can be selected for this poll', { status: 400 });
        }

        // Validate selected options
        const validationResults = await POLLS_DB.prepare(validateOptions)
            .bind(pollId, ...optionIds)
            .all();
        if (validationResults.results.length !== optionIds.length) {
            return new Response('Invalid option IDs provided', { status: 400 });
        }

        const result = await POLLS_DB.prepare(createResponse).bind(user, pollId).run();
        const responseId = result.meta.last_row_id;

        for (const optionId of optionIds) {
            await POLLS_DB.prepare(createResponseOption).bind(responseId, optionId).run();
        }

        return new Response('Vote cast successfully', { status: 201 });
    } catch (error) {
        return new Response(`Error casting vote: ${error.message}`, { status: 500 });
    }
}

// Janky anonymous user ID
const userFromRequest = async (request: Request): Promise<string> => {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const acceptLanguage = request.headers.get('accept-language') || 'unknown';

    const data = new TextEncoder().encode(ip + userAgent + acceptLanguage);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}
