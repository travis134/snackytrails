import { Env } from "@shared/types";

// List polls
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;

    const { polls } = await pollsService.listPolls();

    return Response.json({ polls });
};
