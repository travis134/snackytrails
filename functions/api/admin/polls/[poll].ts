import { BadRequestError, NotFoundError } from "@shared/errors";
import { Env, Poll } from "@shared/types";

// Update a poll
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const pollUpdate: Partial<Poll> = await context.request.json();

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
