import { EntityId } from "../domain/entities/EntityId.js";
import User from "../domain/entities/User.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import { IStorageService } from "../domain/services/IStorageService.js";
import BadRequestError from "../errors/BadRequestError.js";

interface UpdateUserRequest {
    id: string;
    name: string;
    lastName: string;
    email: string;
    location: string;
    profileImageBuffer?: Buffer;
}

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly storageService: IStorageService
    ) {}

    async execute(updateUserRequest: UpdateUserRequest): Promise<User> {
        const user = await this.userRepository.getById(new EntityId(updateUserRequest.id));

        if (!user) {
            throw new BadRequestError("user not found");
        }

        const updatedUser = new User({
            id: user.id,
            name: updateUserRequest.name,
            lastName: updateUserRequest.lastName,
            email: user.email,
            location: updateUserRequest.location,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: new Date(),
            imageId: user.imageId,
        });

        const userAfterUpdate = await this.userRepository.update(updatedUser);

        if (!updateUserRequest.profileImageBuffer) {
            return userAfterUpdate;
        }

        if (updateUserRequest.profileImageBuffer.byteLength > 1024 * 1024 * 2) {
            throw new BadRequestError("Image must be smaller than 2MB");
        }

        if (user.imageId) {
            await this.storageService.deleteFile(user.imageId);
        }

        const imageId = await this.storageService.uploadFile(updateUserRequest.profileImageBuffer);

        return await this.userRepository.updateProfileImage(user.id, imageId);
    }
}
