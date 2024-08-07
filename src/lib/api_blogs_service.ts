import { AppError, ErrorCode } from "@shared/errors";
import { PaginatedBlogs, Blog, isBlog } from "@shared/types";
import { BlogsService } from "@types";

export class APIBlogsService implements BlogsService {
    apiBaseUrl: string;

    constructor({ apiBaseUrl }: { apiBaseUrl: string }) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async readBlog(blogId: string): Promise<Blog> {
        const url = new URL(`/api/blogs/${blogId}`, this.apiBaseUrl);
        const response = await fetch(url, { method: "get" });
        const { blog } = await response.json();
        if (!isBlog(blog)) {
            throw new AppError(
                `Invalid blog: ${JSON.stringify(blog)}`,
                ErrorCode.BlogInvalid
            );
        }

        return blog;
    }

    async listBlogs(limit: number, offset: number): Promise<PaginatedBlogs> {
        const url = new URL(`/api/blogs`, this.apiBaseUrl);
        url.searchParams.append("limit", limit.toString(10));
        url.searchParams.append("offset", offset.toString(10));
        const response = await fetch(url, { method: "get" });
        const { blogs, more } = await response.json();
        for (const blog of blogs) {
            if (!isBlog(blog)) {
                throw new AppError(
                    `Invalid blog: ${JSON.stringify(blog)}`,
                    ErrorCode.BlogInvalid
                );
            }
        }

        return { blogs, more };
    }
}
