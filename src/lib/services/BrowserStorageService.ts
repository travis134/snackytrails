import { StorageService } from "@types";

export class BrowserStorageService implements StorageService {
    store(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    retrieve(key: string) {
        return localStorage.getItem(key);
    }

    delete(key: string) {
        localStorage.removeItem(key);
    }
}
