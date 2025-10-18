export interface IStorageService {
  deleteFile(imageId: string): unknown;
  uploadFile(fileBuffer: Buffer): Promise<string>;
}
