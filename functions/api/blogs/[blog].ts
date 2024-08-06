import { Env } from "@types";

// Read a blog
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { blogsService } = context.env;
    const { blog: blogParam } = context.params;
    const blogId = Array.isArray(blogParam) ? blogParam[0] : blogParam;

    const paginatedBlogs = await blogsService.readBlog(blogId);

    return Response.json(paginatedBlogs);
};
