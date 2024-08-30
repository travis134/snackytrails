import { Authorization, Credentials } from "@shared/types";
import { LoginService } from "@types";
import { AppError, ErrorCode } from "@shared/errors";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const loginQueryKey = "login";

const queryLogin = (): Authorization => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new AppError("Not authorized", ErrorCode.AuthorizationInvalid);
    }

    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Expire 5 minutes early, which is the refresh frequency of this query
        if (payload.exp > Math.floor(Date.now() / 1000) + 3000) {
            throw new AppError(
                "Authorization expired",
                ErrorCode.AuthorizationInvalid
            );
        }
    }

    const authorization = { token };

    return authorization;
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

export const useInvalidateLoginQuery = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: [loginQueryKey] });
    };
};
