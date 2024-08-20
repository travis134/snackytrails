import { AppError, ErrorCode } from "@shared/errors";
import { isVote } from "@shared/types";
import { Env } from "@types";

// Cast a vote
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService, user } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const vote = await context.request.json();

    if (!isVote(vote)) {
        throw new AppError(`Invalid poll vote: ${vote}`, ErrorCode.VoteInvalid);
    }

    await pollsService.votePoll(pollId, user, vote);

    return new Response();
};
