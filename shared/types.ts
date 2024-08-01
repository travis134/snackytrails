import type { D1Database } from "@cloudflare/workers-types"

export interface Env {
    POLLS_DB: D1Database;
}

export interface Poll {
    id: number;
    name: string;
    description: string;
    selections: 'single' | 'multiple';
    created: string;
    ended?: string;
}

export interface Option {
    id: number;
    poll_id: number;
    text: string;
    image?: string;
}

export interface Response {
    id: number;
    user: string;
    poll_id: number;
}

export interface ResponseOption {
    response_id: number;
    option_id: number;
}
