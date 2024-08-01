import { BackendPollsService } from "@lib/backend_polls_service";
import { APIError, InternalServerError, isAPIError } from "@shared/errors";
import { Env } from "@shared/types";

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
            { error: apiError.message },
            {
                status: apiError.status,
            }
        );
    }

    return response;
};

// Polls service dependency
const injectPollsService: PagesFunction<Env> = async (context) => {
    const { env } = context;
    const { POLLS_DB } = env;

    const pollsService = new BackendPollsService({ pollsDb: POLLS_DB });
    env.pollsService = pollsService;

    return context.next();
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

export const onRequest = [
    injectUser,
    logAccess,
    injectPollsService,
    handleErrors,
];
