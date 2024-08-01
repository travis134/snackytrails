export interface Poll {
    id: string;
    name: string;
    description: string;
    selections: "single" | "multiple";
    created?: string;
    ended?: string;
}

export const isPoll = (obj: any): obj is Poll => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.description === "string" &&
        (obj.selections === "single" || obj.selections === "multiple") &&
        (typeof obj.created === "undefined" ||
            typeof obj.created === "string") &&
        (typeof obj.ended === "undefined" ||
            obj.ended === null ||
            typeof obj.ended === "string")
    );
};

export interface Option {
    id?: number;
    poll_id?: string;
    text: string;
    image?: string;
}

export const isOption = (obj: any): obj is Option => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.id === "undefined" || typeof obj.id === "number") &&
        (typeof obj.poll_id === "undefined" ||
            typeof obj.poll_id === "string") &&
        typeof obj.text === "string" &&
        (typeof obj.image === "undefined" ||
            obj.image === null ||
            typeof obj.image === "string")
    );
};

export interface Response {
    id?: number;
    user: string;
    poll_id: string;
}

export const isResponse = (obj: any): obj is Response => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.id === "undefined" || typeof obj.id === "number") &&
        typeof obj.user === "string" &&
        typeof obj.poll_id === "string"
    );
};

export interface ResponseOption {
    response_id: number;
    option_id: number;
}

export const isResponseOption = (obj: any): obj is ResponseOption => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.response_id === "number" &&
        typeof obj.option_id === "number"
    );
};

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
