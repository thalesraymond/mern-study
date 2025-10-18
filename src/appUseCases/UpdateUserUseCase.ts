import { EntityId } from '../domain/entities/EntityId.js';
import User from '../domain/entities/User.js';
import { IUserRepository } from '../domain/repositories/IUserRepository.js';
import { IStorageService } from '../domain/services/IStorageService.js';
import BadRequestError from '../errors/BadRequestError.js';

export class UpdateUserUseCase {
    constructor(
    private readonly userRepository: IUserRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(
    userId: string,
    imageBuffer: Buffer | undefined,
  ): Promise<User> {

    const user = await this.userRepository.getById(new EntityId(userId));

    if (!user) {
      throw new BadRequestError('user not found');
    }

    if(!imageBuffer) {
        throw new BadRequestError('invalid image');
    }

    if(user.imageId) {
        await this.storageService.deleteFile(user.imageId);
    }

    const imageId = await this.storageService.uploadFile(imageBuffer)

    return await this.userRepository.updateProfileImage(user.id, imageId);
  }
}
