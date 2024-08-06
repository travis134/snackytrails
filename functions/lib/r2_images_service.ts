import { R2Bucket } from "@cloudflare/workers-types";
import { ImagesService } from "functions/types";

export class R2ImagesService implements ImagesService {
    imagesBucket: R2Bucket;

    constructor({ imagesBucket }: { imagesBucket: R2Bucket }) {
        this.imagesBucket = imagesBucket;
    }

    async uploadImage(key: string, data: ReadableStream): Promise<void> {
        await this.imagesBucket.put(key, data, {
            httpMetadata: {
                cacheControl: "max-age=604800", // 7 days
            },
        });
    }

    async deleteImage(key: string): Promise<void> {
        await this.imagesBucket.delete(key);
    }
}
