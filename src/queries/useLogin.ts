import { Authorization, Credentials } from "@shared/types";
import { LoginService } from "@types";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const loginQueryKey = "login";

const queryLogin = (): boolean => {
    let isLoggedIn = false;

    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp > Math.floor(Date.now() / 1000)) {
            isLoggedIn = true;
        }
    }

    return isLoggedIn;
};

const setAuthorization = (authorization: Authorization) => {
    const { token } = authorization;
    localStorage.setItem("token", token);
};

export const useLoginQuery = () => {
    return useQuery({
        queryKey: [loginQueryKey],
        queryFn: queryLogin,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 60 * 1000,
        refetchOnWindowFocus: true,
    });
};

export const useLoginMutation = (loginService: LoginService) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: Credentials) => {
            const authorization = await loginService.login(credentials);
            setAuthorization(authorization);
        },
        onSuccess: () => {
            // Invalidate the authStatus query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: [loginQueryKey] });
        },
    });
};
