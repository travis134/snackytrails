import {
    Authorization,
    Blog,
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
}

export interface LoginService {
    login(credentials: Credentials): Promise<Authorization>;
}
