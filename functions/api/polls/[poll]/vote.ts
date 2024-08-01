import { BadRequest, NotFound } from "@shared/errors";
import { Env } from "@shared/types";

// Cast a vote
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const { POLLS_DB } = context.env;
    const { poll: pollId } = context.params;
    const url = new URL(request.url);
    const optionIds = url.searchParams.getAll("option");

    if (!pollId) {
        throw new BadRequest({ message: "Invalid poll" });
    }

    if (optionIds.length === 0) {
        throw new BadRequest({ message: "No options provided" });
    }

    const user = await userFromRequest(request);

    // Validate exists
    const checkSelections = `SELECT selections FROM polls WHERE id = ?`;
    const poll = await POLLS_DB.prepare(checkSelections).bind(pollId).first();
    if (!poll) {
        throw new NotFound();
    }

    // Validate not ended
    if (poll.ended && new Date(poll.ended as string) <= new Date()) {
        throw new BadRequest({ message: "Poll has ended" });
    }

    // Validate selection mode
    if (poll.selections === "single" && optionIds.length > 1) {
        throw new BadRequest({
            message: "Too many options provided",
        });
    }

    // Validate selected options
    const validateOptions = `SELECT id FROM options WHERE poll_id = ? AND id IN (${optionIds
        .map(() => "?")
        .join(", ")})`;
    const validationResults = await POLLS_DB.prepare(validateOptions)
        .bind(pollId, ...optionIds)
        .all();
    if (validationResults.results.length !== optionIds.length) {
        throw new BadRequest({ message: "Invalid option(s)" });
    }

    const createResponse = `INSERT INTO responses (user, poll_id) VALUES (?, ?)`;
    const result = await POLLS_DB.prepare(createResponse)
        .bind(user, pollId)
        .run();
    const responseId = result.meta.last_row_id;

    for (const optionId of optionIds) {
        const createResponseOption = `INSERT INTO response_options (response_id, option_id) VALUES (?, ?)`;
        await POLLS_DB.prepare(createResponseOption)
            .bind(responseId, optionId)
            .run();
    }

    return new Response();
};

// Janky anonymous user ID
const userFromRequest = async (request: Request): Promise<string> => {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const acceptLanguage = request.headers.get("accept-language") || "unknown";

    const data = new TextEncoder().encode(ip + userAgent + acceptLanguage);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
};
