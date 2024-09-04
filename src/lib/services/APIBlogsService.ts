import { AppError, ErrorCode } from "@shared/errors";
import {
    PaginatedBlogs,
    Blog,
    isBlog,
    Authorization,
    BlogUpdate,
} from "@shared/types";
import { BlogsService, UserService } from "@types";
import { appFetch } from "@lib/helpers";

export class APIBlogsService implements BlogsService {
    apiBaseUrl: string;
    userService: UserService;

    constructor({
        apiBaseUrl,
        userService,
    }: {
        apiBaseUrl: string;
        userService: UserService;
    }) {
        this.apiBaseUrl = apiBaseUrl;
        this.userService = userService;
    }

    async readBlog(blogId: string): Promise<Blog> {
        const url = new URL(`/api/blogs/${blogId}`, this.apiBaseUrl);
        const response = await appFetch(url, {
            headers: { "X-User": this.userService.getUser() },
            method: "get",
        });
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
        const url = new URL("/api/blogs", this.apiBaseUrl);
        url.searchParams.append("limit", limit.toString(10));
        url.searchParams.append("offset", offset.toString(10));
        const response = await appFetch(url, {
            headers: { "X-User": this.userService.getUser() },
            method: "get",
        });
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

    async updateBlog(
        authorization: Authorization,
        blogId: string,
        blogUpdate: BlogUpdate
    ): Promise<void> {
        const url = new URL(`/api/admin/blogs/${blogId}`, this.apiBaseUrl);
        await appFetch(url, {
            headers: {
                "X-User": this.userService.getUser(),
                Authorization: `Bearer ${authorization.token}`,
            },
            method: "post",
            body: JSON.stringify(blogUpdate),
        });
    }

    async deleteBlog(
        authorization: Authorization,
        blogId: string
    ): Promise<void> {
        const url = new URL(`/api/admin/blogs/${blogId}`, this.apiBaseUrl);
        await appFetch(url, {
            headers: {
                "X-User": this.userService.getUser(),
                Authorization: `Bearer ${authorization.token}`,
            },
            method: "delete",
        });
    }
}
