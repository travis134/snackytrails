interface RoteConfig {
    path: string;
    href: (params?: Record<string, string | number>) => string;
}

export const HomeRoute = {
    path: "/",
    href: () => "/",
};

export const AboutRoute = {
    path: "/about",
    href: () => "/about",
};

export const PollsRoute = {
    path: "/polls",
    href: () => "/polls",
};

export const PollRoute = {
    path: "/polls/:id",
    href: ({ id }: { id: string }) => `/polls/${id}`,
};
