import { BadRequestError } from "@shared/errors";
import { isOption } from "@shared/types";
import { Env } from "@types";

// Create a new option
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam, option: optionParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const option = await context.request.json();

    if (!isOption(option)) {
        throw new BadRequestError();
    }

    const id = await pollsService.createOption(pollId, option);

    return Response.json({ id });
};
