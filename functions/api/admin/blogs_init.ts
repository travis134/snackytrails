import { Env } from "@types";

export const onRequest: PagesFunction<Env> = async (context) => {
    const { BLOGS_DB } = context.env;

    const createBlogsTable = `
        CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await BLOGS_DB.prepare(createBlogsTable).run();

    return new Response();
};
