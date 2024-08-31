import { Authorization, Credentials } from "@shared/types";
import { LoginService, StorageService } from "@types";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const authorizationStorageKey = "token";
const authorizationQueryKey = "authorization";
const authorizationRefetchIntervalMs = 60 * 1000;
const authorizationStaleTimeMs = 5 * 60 * 1000;

export const useAuthorizationQuery = ({
    storageService,
}: {
    storageService: StorageService;
}) => {
    return useQuery({
        queryKey: [authorizationQueryKey],
        queryFn: (): Authorization | null => {
            const token = storageService.retrieve(authorizationStorageKey);
            if (!token) {
                return null;
            }
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const staleAtSeconds =
                    payload.exp - authorizationStaleTimeMs / 1000;
                const nowSeconds = Math.floor(Date.now() / 1000);
                if (staleAtSeconds < nowSeconds) {
                    return null;
                }
            }

            const authorization = { token };
            return authorization;
        },
        staleTime: authorizationStaleTimeMs,
        refetchInterval: authorizationRefetchIntervalMs,
        refetchOnWindowFocus: true,
    });
};

export const useAuthorizationMutation = ({
    loginService,
    storageService,
}: {
    loginService: LoginService;
    storageService: StorageService;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: Credentials | null) => {
            if (!credentials) {
                storageService.delete(authorizationStorageKey);
                return;
            }

            const authorization = await loginService.login(credentials);

            const { token } = authorization;
            storageService.store(authorizationStorageKey, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [authorizationQueryKey],
            });
        },
    });
};
