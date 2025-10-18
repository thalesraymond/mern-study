import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { randomUUID } from "crypto";

import { IStorageService } from "../../domain/services/IStorageService.js";

export default class AzureStorageService implements IStorageService {
    private readonly blobServiceClient: BlobServiceClient;
    private readonly containerName = "jobifyprofilepictures";

    constructor() {
        const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.blobServiceClient = BlobServiceClient.fromConnectionString(connStr ?? "");
    }

    private getBlockBlobClient(blobName: string): BlockBlobClient {
        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        return containerClient.getBlockBlobClient(blobName);
    }

    public async uploadFile(buffer: Buffer): Promise<string> {
        const blobName = randomUUID();
        const blockBlobClient = this.getBlockBlobClient(blobName);
        await blockBlobClient.upload(buffer, buffer.length);
        return blobName;
    }

    public async deleteFile(imageId: string): Promise<void> {
        const blockBlobClient = this.getBlockBlobClient(imageId);

        await blockBlobClient.deleteIfExists();
    }

    public async getFile(blobName: string): Promise<Buffer> {
        const blockBlobClient = this.getBlockBlobClient(blobName);
        return await blockBlobClient.downloadToBuffer();
    }
}
