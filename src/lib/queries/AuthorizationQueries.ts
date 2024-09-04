import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Credentials } from "@shared/types";
import { AuthorizationService } from "@types";

const staleTime = 5 * 60 * 1000;

const authorizationQueryKey = ["authorization"];

export const useAuthorization = ({
    authorizationService,
}: {
    authorizationService: AuthorizationService;
}) => {
    return useQuery({
        queryKey: authorizationQueryKey,
        queryFn: () => {
            return authorizationService.authorization();
        },
        staleTime,
    });
};

export const useAuthorize = ({
    authorizationService,
}: {
    authorizationService: AuthorizationService;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: Credentials) => {
            await authorizationService.authorize(credentials);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: authorizationQueryKey,
            });
        },
    });
};

export const useUnauthorize = ({
    authorizationService,
}: {
    authorizationService: AuthorizationService;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await authorizationService.unauthorize();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: authorizationQueryKey,
            });
        },
    });
};
