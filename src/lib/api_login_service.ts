import { AppError, ErrorCode } from "@shared/errors";
import {
    Credentials,
    Authorization,
    isCredentials,
    isAuthorization,
} from "@shared/types";
import { LoginService } from "@types";
import { appFetch } from "@lib/helpers";

export class APILoginService implements LoginService {
    apiBaseUrl: string;

    constructor({ apiBaseUrl }: { apiBaseUrl: string }) {
        this.apiBaseUrl = apiBaseUrl;
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
