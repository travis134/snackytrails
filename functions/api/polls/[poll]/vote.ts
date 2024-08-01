import { BadRequestError, NotFoundError } from "@shared/errors";
import { Env } from "@shared/types";

// Cast a vote
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const { POLLS_DB, user } = context.env;
    const { poll: pollId } = context.params;
    const url = new URL(request.url);
    const optionIds = url.searchParams.getAll("option");

    if (!pollId) {
        throw new BadRequestError({ message: "Invalid poll" });
    }

    if (optionIds.length === 0) {
        throw new BadRequestError({ message: "No options provided" });
    }

    // Validate exists
    const checkSelections = `SELECT selections FROM polls WHERE id = ?`;
    const poll = await POLLS_DB.prepare(checkSelections).bind(pollId).first();
    if (!poll) {
        throw new NotFoundError();
    }

    // Validate user not already voted
    const checkVoted = `SELECT id FROM responses WHERE poll_id = ? AND user = ?`;
    const votedResults = await POLLS_DB.prepare(checkVoted)
        .bind(pollId, user)
        .first();
    if (votedResults) {
        throw new BadRequestError({
            errorCode: "user_already_voted",
            message: "User already voted",
        });
    }

    // Validate not ended
    if (poll.ended && new Date(poll.ended as string) <= new Date()) {
        throw new BadRequestError({ message: "Poll has ended" });
    }

    // Validate selection mode
    if (poll.selections === "single" && optionIds.length > 1) {
        throw new BadRequestError({
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
        throw new BadRequestError({ message: "Invalid option(s)" });
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
