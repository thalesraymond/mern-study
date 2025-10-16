import { EntityId } from "../domain/entities/EntityId.js";
import UserRole from "../domain/entities/UserRole.js";
import { IUserRepository } from "../domain/repositories/IUserRepository.js";
import UnauthenticatedError from "../errors/UnauthenticatedError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

export default class ValidateOwnershipUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    public async execute(authenticatedUserId: EntityId, documentOwnerId: EntityId): Promise<void> {
        const user = await this.userRepository.getById(authenticatedUserId);
        if (!user) {
            throw new UnauthenticatedError("Authentication Invalid");
        }

        const isOwner = documentOwnerId.toString() === user.id.toString();
        const isAdmin = user.role === UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedError("Not authorized to access this route");
        }
    }
}
