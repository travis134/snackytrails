import type { D1Database } from "@cloudflare/workers-types";

export interface Env {
    API_KEY: string;
    POLLS_DB: D1Database;
}

export interface Poll {
    id: string;
    name: string;
    description: string;
    selections: "single" | "multiple";
    created: string;
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
        typeof obj.created === "string" &&
        (typeof obj.ended === "undefined" || typeof obj.ended === "string")
    );
};

export interface Option {
    id: number;
    poll_id: string;
    text: string;
    image?: string;
}

export const isOption = (obj: any): obj is Option => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "number" &&
        typeof obj.poll_id === "string" &&
        typeof obj.text === "string" &&
        (typeof obj.image === "undefined" || typeof obj.image === "string")
    );
};

export interface Response {
    id: number;
    user: string;
    poll_id: string;
}

export const isResponse = (obj: any): obj is Response => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "number" &&
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
