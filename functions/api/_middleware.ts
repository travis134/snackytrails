import { D1BlogsService } from "@lib/d1_blogs_service";
import { D1PollsService } from "@lib/d1_polls_service";
import { R2ImagesService } from "@lib/r2_images_service";
import {
    AppError,
    AppErrorData,
    ErrorCode,
    isAppError,
    statusFromErrorCode,
} from "@shared/errors";
import { Env } from "@types";

// CORS
export const onRequestOptions: PagesFunction<Env> = async (context) => {
    const { ORIGIN } = context.env;
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": ORIGIN,
            "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept, Authorization",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Max-Age": "86400",
        },
    });
};

export const setCorsHeaders: PagesFunction<Env> = async (context) => {
    const response = await context.next();
    const { ORIGIN } = context.env;
    response.headers.set("Access-Control-Allow-Origin", ORIGIN);
    response.headers.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
};

// Janky anonymous user ID
const injectUser: PagesFunction<Env> = async (context) => {
    const { env, request } = context;

    // Get the X-User-ID header value
    const userId = request.headers.get("X-User-ID");

    if (userId) {
        // If the X-User-ID header is present, use it as the user identifier
        env.user = userId;
    } else {
        // If the header is missing, throw an AppError with the appropriate error code
        throw new AppError("X-User-ID header is missing", ErrorCode.RequestInvalid);
    }

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

// Blogs service dependency
const injectBlogsService: PagesFunction<Env> = async (context) => {
    const { env } = context;
    const { BLOGS_DB } = env;

    const blogsService = new D1BlogsService({ blogsDb: BLOGS_DB });
    env.blogsService = blogsService;

    return context.next();
};

// Images service dependency
const injectImagesService: PagesFunction<Env> = async (context) => {
    const { env } = context;
    const { IMAGES_BUCKET } = env;

    const imagesService = new R2ImagesService({ imagesBucket: IMAGES_BUCKET });
    env.imagesService = imagesService;

    return context.next();
};

// Error handling
const handleErrors: PagesFunction<Env> = async (context) => {
    let response: Response;
    try {
        response = await context.next();
    } catch (error) {
        let errorData: AppErrorData = {
            error: "Unknown error",
            error_code: ErrorCode.Unknown,
        };
        if (isAppError(error)) {
            errorData = error;
        }

        console.error(error);

        response = Response.json(errorData, {
            status: statusFromErrorCode(errorData.error_code),
        });
    }

    return response;
};

export const onRequest = [
    setCorsHeaders,
    injectUser,
    logAccess,
    injectPollsService,
    injectBlogsService,
    injectImagesService,
    handleErrors,
];
