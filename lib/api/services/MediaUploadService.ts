import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface UploadResult {
    url: string;
    filename: string;
    size: number;
    sizeFormatted: string;
    fileType: string;
}

export class MediaUploadService {
    /**
     * Upload an image, video, document, or PDF to the backend media storage.
     * @param file The File object from input[type="file"] or Dropzone
     * @param folder The target subfolder (e.g. "news", "gallery", "attachments")
     */
    public static async upload(file: File, folder: string = "news"): Promise<UploadResult> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/upload/',
            body: formData,
        });
    }
}
