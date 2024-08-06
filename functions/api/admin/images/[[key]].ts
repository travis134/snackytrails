import { AppError, ErrorCode } from "@shared/errors";
import { Env } from "@types";

// Upload an image
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { imagesService } = context.env;
    const { key: keyParam } = context.params;
    const key = Array.isArray(keyParam) ? keyParam.join("/") : keyParam;
    const data = await context.request.body;

    if (key.length <= 0) {
        throw new AppError(
            `Invalid image upload: ${key}`,
            ErrorCode.OptionUpdateInvalid
        );
    }

    await imagesService.uploadImage(key, data);

    return new Response();
};

// Delete an image
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { imagesService } = context.env;
    const { key: keyParam } = context.params;
    const key = Array.isArray(keyParam) ? keyParam.join("/") : keyParam;

    if (key.length <= 0) {
        throw new AppError(
            `Invalid image upload: ${key}`,
            ErrorCode.OptionUpdateInvalid
        );
    }

    await imagesService.deleteImage(key);

    return new Response();
};
