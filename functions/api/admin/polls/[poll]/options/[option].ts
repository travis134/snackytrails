import { BadRequestError, NotFoundError } from "@shared/errors";
import { Option } from "@shared/types";
import { Env } from "@types";

// Update an option
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam, option: optionParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const optionId = Number(
        Array.isArray(optionParam) ? optionParam[0] : optionParam
    );
    const optionUpdate: Partial<Option> = await context.request.json();

    if (isNaN(optionId)) {
        throw new BadRequestError();
    }

    await pollsService.updateOption(pollId, optionId, optionUpdate);

    return new Response();
};

// Delete an option
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam, option: optionParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const optionId = Number(
        Array.isArray(optionParam) ? optionParam[0] : optionParam
    );

    if (isNaN(optionId)) {
        throw new BadRequestError();
    }

    await pollsService.deleteOption(pollId, optionId);

    return new Response();
};
