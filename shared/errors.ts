import { assertUnreachable } from "./helpers";

export enum ErrorCode {
    RequestInvalid = "request_invalid",
    RequestUnauthorized = "request_unauthorized",
    LoginInvalid = "login_invalid",
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
    VoteInvalid = "vote_invalid",
    VoteNoOptions = "vote_no_options",
    VoteTooManyOptions = "vote_too_many_options",
    VoteInvalidOptions = "vote_invalid_options",
    VoteUserAlreadyVoted = "vote_user_already_voted",
    ImageUploadInvalid = "image_upload_invalid",
    ImageDeleteInvalid = "image_delete_invalid",
    BlogInvalid = "blog_invalid",
    BlogCreateInvalid = "blog_create_invalid",
    BlogUpdateInvalid = "blog_update_invalid",
    BlogNotFound = "blog_not_found",
    Unknown = "unknown",
}

export const statusFromErrorCode = (errorCode: ErrorCode): number => {
    switch (errorCode) {
        case ErrorCode.RequestInvalid:
            return 400;
        case ErrorCode.RequestUnauthorized:
            return 401;
        case ErrorCode.LoginInvalid:
            return 400;
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
        case ErrorCode.VoteInvalid:
            return 400;
        case ErrorCode.VoteNoOptions:
            return 400;
        case ErrorCode.VoteTooManyOptions:
            return 400;
        case ErrorCode.VoteInvalidOptions:
            return 400;
        case ErrorCode.VoteUserAlreadyVoted:
            return 400;
        case ErrorCode.ImageUploadInvalid:
            return 400;
        case ErrorCode.ImageDeleteInvalid:
            return 400;
        case ErrorCode.BlogInvalid:
            return 400;
        case ErrorCode.BlogCreateInvalid:
            return 400;
        case ErrorCode.BlogUpdateInvalid:
            return 400;
        case ErrorCode.BlogNotFound:
            return 404;
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

export const isAppError = (obj: any): obj is AppError => {
    return typeof obj === "object" && obj !== null && obj.name === "AppError";
};
