import { D1Database } from "@cloudflare/workers-types";

import { AppError, ErrorCode } from "@shared/errors";
import {
    PaginatedBlogs,
    Blog,
    BlogCreate,
    BlogUpdate,
    isBlog,
} from "@shared/types";
import { BlogsService } from "@types";

export class D1BlogsService implements BlogsService {
    blogsDb: D1Database;

    constructor({ blogsDb }: { blogsDb: D1Database }) {
        this.blogsDb = blogsDb;
    }

    async createBlog(blogCreate: BlogCreate): Promise<string> {
        const { id, author, content } = blogCreate;

        const getBlog = `SELECT * FROM blogs WHERE id = ?`;
        const blog = await this.blogsDb.prepare(getBlog).bind(id).first<Blog>();
        if (blog) {
            throw new AppError(
                "Blog already exists",
                ErrorCode.BlogCreateInvalid
            );
        }

        const createBlog = `INSERT INTO blogs (id, author, content) VALUES (?, ?, ?)`;
        await this.blogsDb.prepare(createBlog).bind(id, author, content).run();

        return id;
    }

    async readBlog(blogId: string): Promise<Blog> {
        const getBlog = `SELECT * FROM blogs WHERE id = ?`;
        const blog = await this.blogsDb
            .prepare(getBlog)
            .bind(blogId)
            .first<Blog>();
        if (!blog) {
            throw new AppError("Blog not found", ErrorCode.BlogNotFound);
        }
        if (!isBlog(blog)) {
            throw new Error(`Invalid blog: ${JSON.stringify(blog)}`);
        }

        return blog;
    }

    async listBlogs(limit: number, offset: number): Promise<PaginatedBlogs> {
        const maxLimit = 10;
        limit = Math.min(limit, maxLimit);

        const listBlogs = `
            SELECT * FROM blogs
            ORDER BY created DESC
            LIMIT ? OFFSET ?
        `;
        const { results: blogs } = await this.blogsDb
            .prepare(listBlogs)
            .bind(limit, offset)
            .all<Blog>();
        for (const blog of blogs) {
            if (!isBlog(blog)) {
                throw new AppError("Invalid blog", ErrorCode.BlogInvalid);
            }
        }

        const totalBlogsQuery = `SELECT COUNT(*) as total FROM blogs`;
        const totalBlogs = await this.blogsDb
            .prepare(totalBlogsQuery)
            .first<number>("total");
        const more = offset + limit < totalBlogs;

        return { blogs, more };
    }

    async updateBlog(blogId: string, blogUpdate: BlogUpdate): Promise<void> {
        const { author, content } = blogUpdate;
        const fields: string[] = [];
        const values: any[] = [];
        if (author) {
            fields.push("author = ?");
            values.push(author);
        }
        if (content) {
            fields.push("content = ?");
            values.push(content);
        }

        const getBlog = `SELECT * FROM blogs WHERE id = ?`;
        const blog = await this.blogsDb
            .prepare(getBlog)
            .bind(blogId)
            .first<Blog>();
        if (!blog) {
            throw new AppError("Blog not found", ErrorCode.BlogNotFound);
        }

        const updateBlog = `UPDATE blogs SET ${fields.join(", ")} WHERE id = ?`;
        await this.blogsDb
            .prepare(updateBlog)
            .bind(...values, blogId)
            .run();
    }

    async deleteBlog(blogId: string): Promise<void> {
        const getBlog = `SELECT * FROM blogs WHERE id = ?`;
        const blog = await this.blogsDb
            .prepare(getBlog)
            .bind(blogId)
            .first<Blog>();
        if (!blog) {
            throw new AppError("Blog not found", ErrorCode.BlogNotFound);
        }

        const deleteBlog = `DELETE FROM blogs WHERE id = ?`;
        await this.blogsDb.prepare(deleteBlog).bind(blogId).run();
    }
}
