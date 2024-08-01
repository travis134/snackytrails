import { Env } from "@types";

// List poll options
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const { poll: pollParam } = context.params;
    const pollId = Array.isArray(pollParam) ? pollParam[0] : pollParam;

    const options = await pollsService.listOptions(pollId);

    return Response.json({ options });
};
