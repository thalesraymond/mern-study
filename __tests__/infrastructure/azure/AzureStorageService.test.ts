import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import AzureStorageService from '../../../src/infrastructure/azure/AzureStorageService.js';
import { BlobServiceClient } from '@azure/storage-blob';

vi.mock('@azure/storage-blob');

describe('AzureStorageService', () => {
    let storageService: AzureStorageService;
    let mockBlobServiceClient: any;
    let mockBlockBlobClient: any;

    beforeEach(() => {
        mockBlockBlobClient = {
            upload: vi.fn(),
            deleteIfExists: vi.fn(),
            downloadToBuffer: vi.fn(),
        };

        const mockContainerClient = {
            getBlockBlobClient: vi.fn().mockReturnValue(mockBlockBlobClient),
        };

        mockBlobServiceClient = {
            getContainerClient: vi.fn().mockReturnValue(mockContainerClient),
        };

        (BlobServiceClient.fromConnectionString as Mock).mockReturnValue(mockBlobServiceClient);

        storageService = new AzureStorageService();
    });

    describe('uploadFile', () => {
        it('should upload a file and return the blob name', async () => {
            const buffer = Buffer.from('test');
            const blobName = await storageService.uploadFile(buffer);
            expect(mockBlockBlobClient.upload).toHaveBeenCalledWith(buffer, buffer.length);
            expect(blobName).toBeTypeOf('string');
        });
    });

    describe('deleteFile', () => {
        it('should delete a file', async () => {
            const imageId = 'testImageId';
            await storageService.deleteFile(imageId);
            expect(mockBlockBlobClient.deleteIfExists).toHaveBeenCalled();
        });
    });

    describe('getFile', () => {
        it('should get a file', async () => {
            const blobName = 'testBlobName';
            const buffer = Buffer.from('test');
            mockBlockBlobClient.downloadToBuffer.mockResolvedValue(buffer);
            const result = await storageService.getFile(blobName);
            expect(mockBlockBlobClient.downloadToBuffer).toHaveBeenCalled();
            expect(result).toBe(buffer);
        });
    });
});
