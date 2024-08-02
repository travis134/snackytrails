import { AppError, ErrorCode } from "@shared/errors";
import { isPollUpdate, Poll } from "@shared/types";
import { Env } from "@types";

// Update a poll
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const pollUpdate = await context.request.json();

    if (!isPollUpdate(pollUpdate)) {
        throw new AppError(
            `Invalid poll update: ${pollUpdate}`,
            ErrorCode.OptionUpdateInvalid
        );
    }

    await pollsService.updatePoll(pollId, pollUpdate);

    return new Response();
};

// Delete a poll
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;

    await pollsService.deletePoll(pollId);

    return new Response();
};
