import { Authorization, BlogCreate, BlogUpdate } from "@shared/types";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { BlogsService } from "@types";

const staleTime = 5 * 60 * 1000;

const blogsQueryKey = ["blogs"];
const getBlogQueryKey = (blogId: string) => {
    return [...blogsQueryKey, blogId];
};

export const useCreateBlog = ({
    blogsService,
    authorization,
}: {
    blogsService: BlogsService;
    authorization: Authorization;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (blogCreate: BlogCreate) => {
            await blogsService.createBlog(authorization!, blogCreate);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: blogsQueryKey,
                exact: true,
            });
        },
    });
};

export const useReadBlog = ({
    blogsService,
    blogId,
}: {
    blogsService: BlogsService;
    blogId: string;
}) => {
    return useQuery({
        queryKey: getBlogQueryKey(blogId),
        queryFn: async () => {
            return blogsService.readBlog(blogId!);
        },
        staleTime,
    });
};

export const useListBlogs = ({
    blogsService,
    limit,
}: {
    blogsService: BlogsService;
    limit: number;
}) => {
    return useInfiniteQuery({
        queryKey: blogsQueryKey,
        queryFn: async ({ pageParam = 0 }) => {
            return blogsService.listBlogs(limit, pageParam);
        },
        getNextPageParam: (lastPage, allPages) =>
            lastPage.more ? allPages.length * limit : undefined,
        initialPageParam: 0,
        staleTime,
    });
};

export const useUpdateBlog = ({
    blogsService,
    authorization,
    blogId,
}: {
    blogsService: BlogsService;
    authorization: Authorization;
    blogId: string;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (blogUpdate: BlogUpdate) => {
            await blogsService.updateBlog(authorization!, blogId, blogUpdate);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: blogsQueryKey,
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: getBlogQueryKey(blogId),
            });
        },
    });
};

export const useDeleteBlog = ({
    blogsService,
    authorization,
    blogId,
}: {
    blogsService: BlogsService;
    authorization: Authorization;
    blogId: string;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await blogsService.deleteBlog(authorization!, blogId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: blogsQueryKey,
                exact: true,
            });
        },
    });
};
