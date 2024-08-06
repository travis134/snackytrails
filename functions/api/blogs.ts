import { Env } from "@types";

// List blogs
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { blogsService } = context.env;
    const url = new URL(context.request.url);
    const params = new URLSearchParams(url.search);
    let limit = parseInt(params.get("limit") || "10", 10);
    let offset = parseInt(params.get("offset") || "0", 10);

    const paginatedBlogs = await blogsService.listBlogs(limit, offset);

    return Response.json(paginatedBlogs);
};
