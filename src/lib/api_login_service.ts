import { AppError, ErrorCode } from "@shared/errors";
import {
    Credentials,
    Authorization,
    isCredentials,
    isAuthorization,
} from "@shared/types";
import { LoginService, UserService } from "@types";
import { appFetch } from "@lib/helpers";

export class APILoginService implements LoginService {
    apiBaseUrl: string;
    userService: UserService;

    constructor({
        apiBaseUrl,
        userService,
    }: {
        apiBaseUrl: string;
        userService: UserService;
    }) {
        this.apiBaseUrl = apiBaseUrl;
        this.userService = userService;
    }

    async login(credentials: Credentials): Promise<Authorization> {
        if (!isCredentials(credentials)) {
            throw new AppError(
                `Invalid credentials: ${JSON.stringify(credentials)}`,
                ErrorCode.CredentialsInvalid
            );
        }

        const url = new URL("/api/login", this.apiBaseUrl);
        const response = await appFetch(url, {
            headers: { "X-User": this.userService.getUser() },
            method: "post",
            body: JSON.stringify(credentials),
        });
        const { authorization } = await response.json();
        if (!isAuthorization(authorization)) {
            throw new AppError(
                `Invalid authorization: ${JSON.stringify(authorization)}`,
                ErrorCode.AuthorizationInvalid
            );
        }

        return authorization;
    }
}
