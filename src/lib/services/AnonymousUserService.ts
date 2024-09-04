import { v4 as uuidv4 } from "uuid";

import { UserService, StorageService } from "@types";

const userStorageKey = "user";

export class AnonymousUserService implements UserService {
    storageService: StorageService;

    constructor({ storageService }: { storageService: StorageService }) {
        this.storageService = storageService;
    }

    getUser(): string {
        let user = this.storageService.retrieve(userStorageKey);

        if (!user) {
            user = uuidv4();
            this.storageService.store(userStorageKey, user);
        }

        return user;
    }
}
