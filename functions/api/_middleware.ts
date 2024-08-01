import { APIError, InternalServerError, isAPIError } from "@shared/errors";
import { Env } from "@shared/types";

// Error handling
export async function onRequest(
    context: EventContext<Env, any, Record<string, unknown>>
) {
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
}
