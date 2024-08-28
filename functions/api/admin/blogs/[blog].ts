import { AppError, ErrorCode } from "@shared/errors";
import { isBlogUpdate } from "@shared/types";
import { Env } from "@types";

export { onRequestGet } from "@api/blogs/[blog]";

// Update a blog
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { blogsService } = context.env;
    const { blog: blogParam } = context.params;
    const blogId = Array.isArray(blogParam) ? blogParam[0] : blogParam;
    const blogUpdate = await context.request.json();

    if (!isBlogUpdate(blogUpdate)) {
        throw new AppError(
            `Invalid blog update: ${blogUpdate}`,
            ErrorCode.OptionUpdateInvalid
        );
    }

    await blogsService.updateBlog(blogId, blogUpdate);

    return new Response();
};

// Delete a blog
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { blogsService } = context.env;
    const { blog: blogParam } = context.params;
    const blogId = Array.isArray(blogParam) ? blogParam[0] : blogParam;

    await blogsService.deleteBlog(blogId);

    return new Response();
};
