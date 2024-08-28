import { AppError, ErrorCode } from "@shared/errors";
import { isOptionUpdate } from "@shared/types";
import { Env } from "@types";

export { onRequestGet } from "@api/polls/[poll]/options";

// Update an option
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam, option: optionParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const optionId = Number(
        Array.isArray(optionParam) ? optionParam[0] : optionParam
    );
    const optionUpdate = await context.request.json();

    if (isNaN(optionId)) {
        throw new AppError(
            "Option values must be a number",
            ErrorCode.OptionBadValue
        );
    }

    if (!isOptionUpdate(optionUpdate)) {
        throw new AppError(
            `Invalid option update: ${optionUpdate}`,
            ErrorCode.OptionUpdateInvalid
        );
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
        throw new AppError(
            "Option values must be a number",
            ErrorCode.OptionBadValue
        );
    }

    await pollsService.deleteOption(pollId, optionId);

    return new Response();
};
