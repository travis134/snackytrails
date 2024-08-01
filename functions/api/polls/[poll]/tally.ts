import { NotFoundError } from "@shared/errors";
import { Env } from "@shared/types";

// Tally votes on a poll
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;

    const { found, tallies } = await pollsService.tallyPoll(pollId);
    if (!found) {
        throw new NotFoundError();
    }

    return Response.json({ tallies });
};
