import { NotFoundError } from "@shared/errors";
import { Env } from "@shared/types";

// Tally votes
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;

    const tallies = await pollsService.tallyPoll(pollId);

    return Response.json({ tallies });
};
