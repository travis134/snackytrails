interface RouteConfig {
    path: string;
    href: (params?: Record<string, any>) => string;
}

const HomeRoute: RouteConfig = {
    path: "/",
    href: () => "/",
};

const AboutRoute: RouteConfig = {
    path: "about",
    href: () => "/about",
};

const BlogsRoute: RouteConfig = {
    path: "blog",
    href: () => "/blog",
};

const BlogRoute: RouteConfig = {
    path: "blog/:id",
    href: (params?: Record<string, string | number>) => {
        if (!params || !params.id) {
            throw new Error("BlogRoute requires an id parameter");
        }
        return `/blog/${params.id}`;
    },
};

const PollsRoute: RouteConfig = {
    path: "polls",
    href: () => "/polls",
};

const PollRoute: RouteConfig = {
    path: "polls/:id",
    href: (params?: Record<string, string | number>) => {
        if (!params || !params.id) {
            throw new Error("PollRoute requires an id parameter");
        }
        return `/polls/${params.id}`;
    },
};

const PollResultsRoute: RouteConfig = {
    path: "polls/:id/results",
    href: (params?: Record<string, string | number>) => {
        if (!params || !params.id) {
            throw new Error("PollResultsRoute requires an id parameter");
        }
        return `/polls/${params.id}/results`;
    },
};
const Routes: Record<string, RouteConfig> = {
    HomeRoute,
    AboutRoute,
    BlogsRoute,
    BlogRoute,
    PollsRoute,
    PollRoute,
    PollResultsRoute,
};

export default Routes;
