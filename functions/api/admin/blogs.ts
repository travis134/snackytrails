import { AppError, ErrorCode } from "@shared/errors";
import { isBlogCreate } from "@shared/types";
import { Env } from "@types";

export { onRequestGet } from "@api/blogs";

// Create a new blog
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { blogsService } = context.env;
    const blog = await context.request.json();

    if (!isBlogCreate(blog)) {
        throw new AppError("Invalid blog create", ErrorCode.BlogCreateInvalid);
    }

    const id = await blogsService.createBlog(blog);

    return Response.json({ id });
};
