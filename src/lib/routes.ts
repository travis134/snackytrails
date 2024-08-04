interface RouteConfig {
    path: string;
    href: (params?: Record<string, string | number>) => string;
}

export const HomeRoute: RouteConfig = {
    path: "/",
    href: () => "/",
};

export const AboutRoute: RouteConfig = {
    path: "/about",
    href: () => "/about",
};

export const PollsRoute: RouteConfig = {
    path: "/polls",
    href: () => "/polls",
};

export const PollRoute: RouteConfig = {
    path: "/polls/:id",
    href: (params?: Record<string, string | number>) => {
        if (!params || !params.id) {
            throw new Error("PollRoute requires an id parameter");
        }
        return `/polls/${params.id}`;
    },
};
