// Basic Authorization
export async function onRequest(context) {
    const { request, env } = context;
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || authHeader !== `Bearer ${env.API_KEY}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    return await context.next();
}
