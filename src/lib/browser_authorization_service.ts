import { Authorization, Credentials } from "@shared/types";
import { LoginService, StorageService, AuthorizationService } from "@types";

const authorizationStorageKey = "token";

export class BrowserAuthorizationService implements AuthorizationService {
    loginService: LoginService;
    storageService: StorageService;

    constructor({
        loginService,
        storageService,
    }: {
        loginService: LoginService;
        storageService: StorageService;
    }) {
        this.loginService = loginService;
        this.storageService = storageService;
    }

    async authorize(credentials: Credentials): Promise<void> {
        const authorization = await this.loginService.login(credentials);
        const { token } = authorization;
        this.storageService.store(authorizationStorageKey, token);
    }

    authorization(): Authorization | null {
        const token = this.storageService.retrieve(authorizationStorageKey);
        if (!token) {
            return null;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiredAtSeconds = payload.exp;
        const nowSeconds = Math.floor(Date.now() / 1000);

        if (expiredAtSeconds < nowSeconds) {
            return null;
        }

        return { token };
    }

    unauthorize(): void {
        this.storageService.delete(authorizationStorageKey);
    }
}
