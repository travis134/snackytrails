import { BadRequestError, NotFoundError } from "@shared/errors";
import { Env, Poll } from "@shared/types";

// Update a poll
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const pollUpdate: Partial<Poll> = await context.request.json();

    const { valid, found } = await pollsService.updatePoll(pollId, pollUpdate);
    if (!valid) {
        throw new BadRequestError();
    }
    if (!found) {
        throw new NotFoundError();
    }

    return new Response();
};

// Delete a poll
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;

    const { found } = await pollsService.deletePoll(pollId);
    if (!found) {
        throw new NotFoundError();
    }

    return new Response();
};
