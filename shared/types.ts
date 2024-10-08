export interface Poll {
    id: string;
    name: string;
    description: string;
    selections: "single" | "multiple";
    created: string;
    ended: string | null;
}

export const isPoll = (obj: any): obj is Poll => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.description === "string" &&
        (obj.selections === "single" || obj.selections === "multiple") &&
        typeof obj.created === "string" &&
        (obj.ended === null || typeof obj.ended === "string")
    );
};

export interface PaginatedPolls {
    polls: Poll[];
    more: boolean;
}

export interface PollCreate {
    id: string;
    name: string;
    description: string;
    selections: "single" | "multiple";
}

export const isPollCreate = (obj: any): obj is PollCreate => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.description === "string" &&
        (obj.selections === "single" || obj.selections === "multiple")
    );
};

export interface PollUpdate {
    name?: string;
    description?: string;
    selections?: "single" | "multiple";
    ended?: string | null;
}

export const isPollUpdate = (obj: any): obj is PollUpdate => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (obj.name !== undefined ||
            obj.description !== undefined ||
            obj.selections !== undefined ||
            obj.ended !== undefined)
    );
};

export interface Option {
    id: number;
    poll_id: string;
    text: string;
    image: string | null;
}

export const isOption = (obj: any): obj is Option => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "number" &&
        typeof obj.poll_id === "string" &&
        typeof obj.text === "string" &&
        (obj.image === null || typeof obj.image === "string")
    );
};

export interface OptionCreate {
    text: string;
    image?: string;
}

export const isOptionCreate = (obj: any): obj is OptionCreate => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.text === "string" &&
        (typeof obj.image === "undefined" || typeof obj.image === "string")
    );
};

export interface OptionUpdate {
    text: string;
    image?: string | null;
}

export const isOptionUpdate = (obj: any): obj is OptionUpdate => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (obj.text !== undefined || obj.image !== undefined)
    );
};

export interface Response {
    id?: number;
    user: string;
    poll_id: string;
}

export interface ResponseOption {
    response_id: number;
    option_id: number;
}

export interface Tally {
    poll_id: string;
    option_id: number;
    responses: number;
}

export const isTally = (obj: any): obj is Tally => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.poll_id === "string" &&
        typeof obj.option_id === "number" &&
        typeof obj.responses === "number"
    );
};

export interface Vote {
    option_ids: number[];
}

export const isVote = (obj: any): obj is Vote => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        Array.isArray(obj.option_ids) &&
        obj.option_ids.every((option_id: any) => typeof option_id === "number")
    );
};

export interface Blog {
    id: string;
    author: string;
    content: string;
    created: string;
}

export const isBlog = (obj: any): obj is Blog => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        typeof obj.author === "string" &&
        typeof obj.content === "string" &&
        typeof obj.created === "string"
    );
};

export interface BlogCreate {
    id: string;
    author: string;
    content: string;
}

export const isBlogCreate = (obj: any): obj is BlogCreate => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        typeof obj.author === "string" &&
        typeof obj.content === "string"
    );
};

export interface BlogUpdate {
    author?: string;
    content?: string;
}

export const isBlogUpdate = (obj: any): obj is BlogUpdate => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (obj.author !== undefined || obj.content !== undefined)
    );
};

export interface PaginatedBlogs {
    blogs: Blog[];
    more: boolean;
}

export interface Credentials {
    username: string;
    password: string;
}

export const isCredentials = (obj: any): obj is Credentials => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.username === "string" &&
        typeof obj.password === "string"
    );
};

export interface Authorization {
    token: string;
}

export const isAuthorization = (obj: any): obj is Authorization => {
    return (
        typeof obj === "object" && obj !== null && typeof obj.token === "string"
    );
};
