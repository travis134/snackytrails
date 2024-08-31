import {
    Authorization,
    Blog,
    BlogUpdate,
    Credentials,
    Option,
    PaginatedBlogs,
    PaginatedPolls,
    Poll,
    Tally,
    Vote,
} from "@shared/types";

export interface PollsService {
    readPoll(pollId: string): Promise<Poll>;
    listPolls(limit: number, offset: number): Promise<PaginatedPolls>;
    tallyPoll(pollId: string): Promise<Tally[]>;
    votePoll(pollId: string, vote: Vote): Promise<void>;

    readOption(pollId: string, optionId: number): Promise<Option>;
    listOptions(pollId: string): Promise<Option[]>;
}

export interface BlogsService {
    readBlog(blogId: string): Promise<Blog>;
    listBlogs(limit: number, offset: number): Promise<PaginatedBlogs>;
    updateBlog(
        authorization: Authorization,
        blogId: string,
        blogUpdate: BlogUpdate
    ): Promise<void>;
    deleteBlog(authorization: Authorization, blogId: string): Promise<void>;
}

export interface LoginService {
    login(credentials: Credentials): Promise<Authorization>;
}

export interface StorageService {
    store(key: string, value: string): void;
    retrieve(key: string): string | null;
    delete(key: string): void;
}

export interface UserService {
    getUser(): string;
}
