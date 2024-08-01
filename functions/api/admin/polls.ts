import { BadRequestError } from "@shared/errors";
import { isPoll } from "@shared/types";
import { Env } from "@types";

// Create a new poll
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const poll = await context.request.json();

    if (!isPoll(poll)) {
        throw new BadRequestError();
    }

    const id = await pollsService.createPoll(poll);

    return Response.json({ id });
};
