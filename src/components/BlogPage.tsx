import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Routes from "@lib/routes";
import { useAuthorizationQuery } from "@queries/authorization";
import { BlogsService, StorageService } from "@types";

import ErrorComponent from "@components/ErrorComponent";
import HeroComponent from "@components/HeroComponent";
import HeroSkeletonComponent from "@components/HeroSkeletonComponent";
import BlogContentComponent from "@components/BlogContentComponent";
import BlogContentSkeletonComponent from "./BlogContentSkeletonComponent";
import { BlogUpdate } from "@shared/types";

interface BlogPageProps {
    blogsService: BlogsService;
    storageService: StorageService;
}

const BlogPage: React.FC<BlogPageProps> = ({
    blogsService,
    storageService,
}) => {
    const { id: blogId } = useParams<{ id: string }>();
    const [content, setContent] = useState("");
    const [editing, setEditing] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: authorization } = useAuthorizationQuery({ storageService });

    const editable = editing && !!authorization;

    const {
        data: blog,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["blog", blogId],
        queryFn: () => blogsService.readBlog(blogId!),
    });

    const enableEditing = () => {
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
        setContent(blog!.content);
    };

    const { mutate: saveBlogMutation } = useMutation({
        mutationFn: (blogUpdate: BlogUpdate) =>
            blogsService.updateBlog(authorization!, blog!.id, blogUpdate),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blog", blogId],
            });
            cancelEditing();
        },
    });
    const saveBlog = () => {
        saveBlogMutation({ content });
    };

    const { mutate: deleteBlogMutation } = useMutation({
        mutationFn: () => blogsService.deleteBlog(authorization!, blog!.id),
        onSuccess: () => {
            navigate(Routes.BlogsRoute.href());
        },
    });
    const deleteBlog = () => {
        deleteBlogMutation();
    };

    useEffect(() => {
        if (blog) {
            setContent(blog.content);
        }
    }, [blog]);

    let hero: ReactNode;
    let body: ReactNode;

    if (isLoading) {
        hero = <HeroSkeletonComponent />;
        body = (
            <article className="box mb-5">
                <BlogContentSkeletonComponent />
            </article>
        );
    } else if (error) {
        hero = <HeroSkeletonComponent />;
        body = <ErrorComponent error={error as any} />;
    } else {
        const title = blog!.id;
        const mungedTime = blog!.created.split(" ").join("T") + ".000Z";
        const formattedDate = new Date(mungedTime).toLocaleString();
        const subtitle = `${blog!.author} @ ${formattedDate}`;

        let buttons: ReactNode;
        if (authorization) {
            if (editing) {
                buttons = (
                    <div className="buttons is-right mt-5">
                        <button
                            className="button is-danger"
                            onClick={deleteBlog}
                        >
                            Delete
                        </button>
                        <button className="button" onClick={cancelEditing}>
                            Cancel
                        </button>
                        <button
                            className="button is-primary has-text-white"
                            onClick={saveBlog}
                        >
                            Save
                        </button>
                    </div>
                );
            } else {
                buttons = (
                    <div className="buttons is-right mt-5">
                        <button
                            className="button is-primary has-text-white"
                            onClick={enableEditing}
                        >
                            Edit
                        </button>
                    </div>
                );
            }
        }

        hero = <HeroComponent title={title} subtitle={subtitle} />;
        body = (
            <>
                <article className="box mb-5">
                    <BlogContentComponent
                        content={content}
                        setContent={setContent}
                        editable={editable}
                    />
                    {buttons}
                </article>
                <a
                    className={"button is-white has-text-primary is-fullwidth"}
                    href={Routes.BlogsRoute.href()}
                >
                    Read more
                </a>
            </>
        );
    }

    return (
        <>
            {hero}
            <section className="section">{body}</section>
        </>
    );
};

export default BlogPage;
