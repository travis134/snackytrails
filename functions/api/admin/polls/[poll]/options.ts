import { AppError, ErrorCode } from "@shared/errors";
import { isOptionCreate } from "@shared/types";
import { Env } from "@types";

// Create a new option
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam, option: optionParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;
    const optionCreate = await context.request.json();

    if (!isOptionCreate(optionCreate)) {
        throw new AppError(
            `Invalid option create: ${optionCreate}`,
            ErrorCode.OptionCreateInvalid
        );
    }

    const id = await pollsService.createOption(pollId, optionCreate);

    return Response.json({ id });
};
