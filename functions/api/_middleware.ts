import { D1PollsService } from "@lib/d1_polls_service";
import { APIError, InternalServerError, isAPIError } from "@shared/errors";
import { Env } from "@types";

// CORS
export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Max-Age": "86400",
        },
    });
};

export const setCorsHeaders: PagesFunction = async (context) => {
    const response = await context.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
};

// Janky anonymous user ID
const injectUser: PagesFunction<Env> = async (context) => {
    const { env, request } = context;

    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const acceptLanguage = request.headers.get("accept-language") || "unknown";
    const data = new TextEncoder().encode(ip + userAgent + acceptLanguage);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const user = Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    env.user = user;

    return context.next();
};

// Request logging
const logAccess: PagesFunction<Env> = async (context) => {
    const { env, request } = context;

    console.log(
        `method="${request.method}" url="${request.url}, user="${env.user}"`
    );

    return context.next();
};

// Polls service dependency
const injectPollsService: PagesFunction<Env> = async (context) => {
    const { env } = context;
    const { POLLS_DB } = env;

    const pollsService = new D1PollsService({ pollsDb: POLLS_DB });
    env.pollsService = pollsService;

    return context.next();
};

// Error handling
const handleErrors: PagesFunction<Env> = async (context) => {
    let response: Response;
    try {
        response = await context.next();
    } catch (error) {
        let apiError = new InternalServerError({ innerError: error });
        if (isAPIError(error)) {
            apiError = error;
        }

        console.error(apiError.innerError ?? apiError);

        response = Response.json(
            { error: apiError.message, error_code: apiError.errorCode },
            {
                status: apiError.status,
            }
        );
    }

    return response;
};

export const onRequest = [
    setCorsHeaders,
    injectUser,
    logAccess,
    injectPollsService,
    handleErrors,
];
