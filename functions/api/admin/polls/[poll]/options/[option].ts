import { BadRequestError, NotFoundError } from "@shared/errors";
import { Env, Option } from "@shared/types";

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

    const { valid, found } = await pollsService.updateOption(
        pollId,
        optionId,
        optionUpdate
    );
    if (!valid) {
        throw new BadRequestError();
    }
    if (!found) {
        throw new NotFoundError();
    }

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

    const { found } = await pollsService.deleteOption(pollId, optionId);
    if (!found) {
        throw new NotFoundError();
    }

    return new Response();
};
