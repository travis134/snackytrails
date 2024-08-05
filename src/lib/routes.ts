interface RouteConfig {
    path: string;
    href: (params?: Record<string, string | number>) => string;
}

const HomeRoute: RouteConfig = {
    path: "/",
    href: () => "/",
};

const AboutRoute: RouteConfig = {
    path: "/about",
    href: () => "/about",
};

const PollsRoute: RouteConfig = {
    path: "/polls",
    href: () => "/polls",
};

const PollRoute: RouteConfig = {
    path: "/polls/:id",
    href: (params?: Record<string, string | number>) => {
        if (!params || !params.id) {
            throw new Error("PollRoute requires an id parameter");
        }
        return `/polls/${params.id}`;
    },
};

const Routes = {
    HomeRoute,
    AboutRoute,
    PollsRoute,
    PollRoute,
};

export default Routes;
