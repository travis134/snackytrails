interface Env {
    KV: KVNamespace;
}

export const onRequest: PagesFunction = async (context) => {
    return new Response("Hello, admin!")
}
