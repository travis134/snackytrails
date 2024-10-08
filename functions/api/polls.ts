import { Env } from "@types";

// List polls
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { pollsService } = context.env;
    const url = new URL(context.request.url);
    const params = new URLSearchParams(url.search);
    let limit = parseInt(params.get("limit") || "10", 10);
    let offset = parseInt(params.get("offset") || "0", 10);

    const paginatedPolls = await pollsService.listPolls(limit, offset);

    return Response.json(paginatedPolls);
};
