import { AppError, ErrorCode } from "@shared/errors";
import { Env } from "@types";

// Cast a vote
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const { pollsService, user } = context.env;
    const { poll: pollParam, option: optionParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const url = new URL(request.url);
    const optionIdParams = url.searchParams.getAll("option");

    const optionIds = [];
    for (const optionIdParam of optionIdParams) {
        const optionId = Number(optionIdParam);
        if (isNaN(optionId)) {
            throw new AppError(
                "Option values must be a number",
                ErrorCode.OptionBadValue
            );
        }

        optionIds.push(optionId);
    }

    await pollsService.votePoll(pollId, user, optionIds);

    return new Response();
};
