import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserRepository from '../../../src/infrastructure/repositories/UserRepository.js';
import UserModel from '../../../src/infrastructure/models/users/UserModel.js';
import UserAdapter from '../../../src/infrastructure/adapters/UserAdapter.js';
import Email from '../../../src/domain/entities/Email.js';
import User from '../../../src/domain/entities/User.js';
import { EntityId } from '../../../src/domain/entities/EntityId.js';
import UserPassword from '../../../src/domain/entities/UserPassword.js';
import UserRole from '../../../src/domain/entities/UserRole.js';

vi.mock('../../../src/infrastructure/models/users/UserModel.js');
vi.mock('../../../src/infrastructure/adapters/UserAdapter.js');

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let mockUserModel: any;
    let mockUserAdapter: any;

    const userDomain = new User({
        name: 'Test User',
        lastName: 'Test',
        email: Email.create('test@example.com'),
        password: UserPassword.createFromHashed('hashedPassword'),
        role: UserRole.USER,
        location: 'Test Location',
        id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
    });

    const userPersistence = {
        _id: '60d5ec49e0d3f4a3c8d3e8b1',
        name: 'Test User',
        lastName: 'Test',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'USER',
        location: 'Test Location',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        userRepository = new UserRepository();
        mockUserModel = UserModel;
        mockUserAdapter = new UserAdapter();
        userRepository['model'] = mockUserModel;
        userRepository['adapter'] = mockUserAdapter;

        vi.spyOn(mockUserAdapter, 'toDomain').mockResolvedValue(userDomain);
        vi.spyOn(mockUserAdapter, 'toPersistence').mockReturnValue(userPersistence);
    });

    describe('findByEmail', () => {
        it('should return a user when found by email', async () => {
            const email = Email.create('test@example.com');
            mockUserModel.findOne.mockResolvedValue(userPersistence);

            const result = await userRepository.findByEmail(email);

            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockUserAdapter.toDomain).toHaveBeenCalledWith(userPersistence);
            expect(result).toEqual(userDomain);
        });

        it('should return null when no user is found by email', async () => {
            const email = Email.create('notfound@example.com');
            mockUserModel.findOne.mockResolvedValue(null);

            const result = await userRepository.findByEmail(email);

            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
            expect(mockUserAdapter.toDomain).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('count', () => {
        it('should return the total number of users', async () => {
            mockUserModel.countDocuments.mockResolvedValue(10);

            const result = await userRepository.count();

            expect(mockUserModel.countDocuments).toHaveBeenCalled();
            expect(result).toBe(10);
        });
    });

     describe('create', () => {
        it('should create and return a new user', async () => {
            mockUserModel.create.mockResolvedValue(userPersistence);

            const result = await userRepository.create(userDomain);

            expect(mockUserAdapter.toPersistence).toHaveBeenCalledWith(userDomain);
            expect(mockUserModel.create).toHaveBeenCalledWith(userPersistence);
            expect(mockUserAdapter.toDomain).toHaveBeenCalledWith(userPersistence);
            expect(result).toEqual(userDomain);
        });
    });

    describe('update', () => {
        it('should update and return the user', async () => {
            const updatedUserDomain = new User({
                id: userDomain.id,
                name: 'Updated User',
                lastName: userDomain.lastName,
                email: userDomain.email,
                password: userDomain.password,
                role: userDomain.role,
                location: userDomain.location,
            });
            const updatedUserPersistence = { ...userPersistence, name: 'Updated User' };

            const findByIdAndUpdateMock = {
                ...updatedUserPersistence,
            };

            mockUserModel.findByIdAndUpdate.mockResolvedValue(findByIdAndUpdateMock);
            vi.spyOn(mockUserAdapter, 'toDomain').mockResolvedValue(updatedUserDomain);


            const result = await userRepository.update(updatedUserDomain);

            expect(mockUserAdapter.toPersistence).toHaveBeenCalledWith(updatedUserDomain);
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                userDomain.id.toString(),
                expect.any(Object),
                { new: true }
            );
            expect(mockUserAdapter.toDomain).toHaveBeenCalledWith(findByIdAndUpdateMock);
            expect(result).toEqual(updatedUserDomain);
        });
    });

    describe('delete', () => {
        it('should delete a user by id', async () => {
            const userId = new EntityId('60d5ec49e0d3f4a3c8d3e8b1');
            mockUserModel.findByIdAndDelete.mockResolvedValue(true);

            await userRepository.delete(userId);

            expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId.toString());
        });
    });

    describe('getById', () => {
        it('should return a user when found by id', async () => {
            const userId = new EntityId('60d5ec49e0d3f4a3c8d3e8b1');

            const findByIdMock = {
                ...userPersistence,
                populate: vi.fn().mockReturnThis(),
            };

            mockUserModel.findById.mockReturnValue(findByIdMock);
            vi.spyOn(findByIdMock, 'populate').mockResolvedValue(userPersistence);

            const result = await userRepository.getById(userId);

            expect(mockUserModel.findById).toHaveBeenCalledWith(userId.toString());
            expect(findByIdMock.populate).toHaveBeenCalled();
            expect(mockUserAdapter.toDomain).toHaveBeenCalledWith(userPersistence);
            expect(result).toEqual(userDomain);
        });
    });

    describe('listAll', () => {
        it('should return a list of all users', async () => {
            const findMock = {
                ...userPersistence,
                populate: vi.fn().mockReturnThis(),
            };
            mockUserModel.find.mockReturnValue({
                populate: vi.fn().mockResolvedValue([findMock])
            });

            const result = await userRepository.listAll();

            expect(mockUserModel.find).toHaveBeenCalled();
            expect(mockUserAdapter.toDomain).toHaveBeenCalledWith(findMock);
            expect(result).toEqual([userDomain]);
        });
    });
});