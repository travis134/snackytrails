import { assertUnreachable } from "./helpers";

export enum ErrorCode {
    RequestUnauthorized = "request_unauthorized",
    OptionBadValue = "option_bad_value",
    OptionInvalid = "option_invalid",
    OptionCreateInvalid = "option_create_invalid",
    OptionUpdateInvalid = "option_update_invalid",
    OptionNotFound = "option_not_found",
    PollInvalid = "poll_invalid",
    PollCreateInvalid = "poll_create_invalid",
    PollUpdateInvalid = "poll_update_invalid",
    PollNotFound = "poll_not_found",
    TallyInvalid = "tally_invalid",
    VoteNoOptions = "vote_no_options",
    VoteTooManyOptions = "vote_too_many_options",
    VoteInvalidOptions = "vote_invalid_options",
    VoteUserAlreadyVoted = "vote_user_already_voted",
    Unknown = "unknown",
}

export const statusFromErrorCode = (errorCode: ErrorCode): number => {
    switch (errorCode) {
        case ErrorCode.RequestUnauthorized:
            return 401;
        case ErrorCode.OptionBadValue:
            return 400;
        case ErrorCode.OptionInvalid:
            return 400;
        case ErrorCode.OptionCreateInvalid:
            return 400;
        case ErrorCode.OptionUpdateInvalid:
            return 400;
        case ErrorCode.OptionNotFound:
            return 404;
        case ErrorCode.PollInvalid:
            return 400;
        case ErrorCode.PollCreateInvalid:
            return 400;
        case ErrorCode.PollUpdateInvalid:
            return 400;
        case ErrorCode.PollNotFound:
            return 404;
        case ErrorCode.TallyInvalid:
            return 400;
        case ErrorCode.VoteNoOptions:
            return 400;
        case ErrorCode.VoteTooManyOptions:
            return 400;
        case ErrorCode.VoteInvalidOptions:
            return 400;
        case ErrorCode.VoteUserAlreadyVoted:
            return 400;
        case ErrorCode.Unknown:
            return 500;
    }
    return assertUnreachable(errorCode);
};

export interface AppErrorData {
    error: string;
    error_code: ErrorCode;
}

export const isAppErrorData = (obj: any): obj is AppErrorData => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.error === "string" &&
        Object.values(ErrorCode).includes(obj.error_code)
    );
};

export class AppError extends Error implements AppErrorData {
    error: string;
    error_code: ErrorCode;

    constructor(error: string, errorCode: ErrorCode) {
        super(error);
        this.name = "AppError";
        this.error = error;
        this.error_code = errorCode;
    }
}

export const isAppError = (error: unknown): error is AppError => {
    return error instanceof AppError;
};
