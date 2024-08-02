import { AppError, ErrorCode } from "@shared/errors";
import { isPollCreate } from "@shared/types";
import { Env } from "@types";

// Create a new poll
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const poll = await context.request.json();

    if (!isPollCreate(poll)) {
        throw new AppError("Invalid poll create", ErrorCode.PollCreateInvalid);
    }

    const id = await pollsService.createPoll(poll);

    return Response.json({ id });
};
