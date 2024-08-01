import { NotFoundError } from "@shared/errors";
import { Env } from "@shared/types";

// Read a poll
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;

    const { found, poll } = await pollsService.readPoll(pollId);
    if (!found) {
        throw new NotFoundError();
    }

    return Response.json({ poll });
};
