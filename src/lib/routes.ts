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

const BlogRoute: RouteConfig = {
    path: "blog",
    href: () => "/blog",
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
        let options: URLSearchParams | null = null;
        const { optionIds } = params;
        if (Array.isArray(optionIds)) {
            options = new URLSearchParams();
            for (const optionId of optionIds) {
                options.append("option", optionId);
            }
        }
        return `/polls/${params.id}/results${
            options && "?" + options.toString()
        }`;
    },
};
const Routes: Record<string, RouteConfig> = {
    HomeRoute,
    AboutRoute,
    BlogRoute,
    PollsRoute,
    PollRoute,
    PollResultsRoute,
};

export default Routes;
