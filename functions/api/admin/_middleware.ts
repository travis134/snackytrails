import { Env } from "@shared/types";

// Basic Authorization
export async function onRequest(
    context: EventContext<Env, any, Record<string, unknown>>
) {
    const { request, env } = context;
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return new Response("Unauthorized", { status: 401 });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = atob(base64Credentials).split(":");
    const apiKey = credentials[0];

    if (apiKey !== env.API_KEY) {
        return new Response("Unauthorized", { status: 401 });
    }

    return await context.next();
}
