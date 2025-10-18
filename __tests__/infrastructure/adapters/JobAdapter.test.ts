import { describe, it, expect, vi, beforeEach } from "vitest";
import JobAdapter from "../../../src/infrastructure/adapters/JobAdapter.js";
import Job from "../../../src/domain/entities/Job.js";
import { EntityId } from "../../../src/domain/entities/EntityId.js";
import JobStatus from "../../../src/infrastructure/models/jobs/JobStatus.js";
import JobType from "../../../src/infrastructure/models/jobs/JobType.js";
import User from "../../../src/domain/entities/User.js";
import Email from "../../../src/domain/entities/Email.js";
import UserPassword from "../../../src/domain/entities/UserPassword.js";
import UserRole from "../../../src/domain/entities/UserRole.js";
import UserModel, { UserSchema } from "../../../src/infrastructure/models/users/UserModel.js";
import NotFoundError from "../../../src/errors/NotFoundError.js";
import { JobSchema } from "../../../src/infrastructure/models/jobs/JobModel.js";
import mongoose, { HydratedDocument } from "mongoose";

vi.mock("../../../src/infrastructure/models/users/UserModel.js");

describe("JobAdapter", () => {
    const adapter = new JobAdapter();

    const createdByUser = new User({
        id: new EntityId(new mongoose.Types.ObjectId().toString()),
        name: "John",
        lastName: "Doe",
        email: Email.create("john.doe@example.com"),
        password: UserPassword.createFromHashed("hashedPassword"),
        location: "New York",
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const rawJob: HydratedDocument<JobSchema> = {
        _id: new mongoose.Types.ObjectId(),
        company: "Google",
        position: "Software Engineer",
        status: JobStatus.PENDING,
        jobType: JobType.FULL_TIME,
        location: "Mountain View",
        createdBy: new mongoose.Types.ObjectId(createdByUser.id.toString()),
        createdAt: new Date(),
        updatedAt: new Date(),
    } as HydratedDocument<JobSchema>;

    const domainJob = new Job({
        id: new EntityId(new mongoose.Types.ObjectId().toString()),
        company: "Facebook",
        position: "Product Manager",
        status: JobStatus.INTERVIEW,
        jobType: JobType.PART_TIME,
        location: "Menlo Park",
        createdBy: createdByUser,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("toDomain", () => {
        it("should convert a raw job object to a domain Job entity when createdBy is populated", async () => {
            const rawJobWithPopulatedUser = {
                ...rawJob,
                populated: vi.fn().mockReturnValue(true),
                createdBy: {
                    _id: new mongoose.Types.ObjectId(createdByUser.id.toString()),
                    name: createdByUser.name,
                    lastName: createdByUser.lastName,
                    email: createdByUser.email.getValue(),
                    password: createdByUser.password.hashedPassword,
                    location: createdByUser.location,
                    role: createdByUser.role,
                },
            } as unknown as HydratedDocument<JobSchema>;

            const job = await adapter.toDomain(rawJobWithPopulatedUser);

            expect(job).toBeInstanceOf(Job);
            expect(job.id.toString()).toBe(rawJob._id.toString());
            expect(job.createdBy.id.toString()).toBe(createdByUser.id.toString());
        });

        it("should convert a raw job object to a domain Job entity and fetch createdBy user", async () => {
            const rawJobWithUnpopulatedUser = {
                ...rawJob,
                populated: vi.fn().mockReturnValue(false),
            } as unknown as HydratedDocument<JobSchema>;

            UserModel.findById = vi.fn().mockResolvedValue({
                _id: new mongoose.Types.ObjectId(createdByUser.id.toString()),
                name: createdByUser.name,
                lastName: createdByUser.lastName,
                email: createdByUser.email.getValue(),
                password: createdByUser.password.hashedPassword,
                location: createdByUser.location,
                role: createdByUser.role,
            } as HydratedDocument<UserSchema>);

            const job = await adapter.toDomain(rawJobWithUnpopulatedUser);

            expect(job).toBeInstanceOf(Job);
            expect(UserModel.findById).toHaveBeenCalledWith(rawJob.createdBy);
            expect(job.createdBy.id.toString()).toBe(createdByUser.id.toString());
        });

        it("should throw NotFoundError if createdBy user is not found", async () => {
            const rawJobWithUnpopulatedUser = {
                ...rawJob,
                populated: vi.fn().mockReturnValue(false),
            } as unknown as HydratedDocument<JobSchema>;
            UserModel.findById = vi.fn().mockResolvedValue(null);

            await expect(adapter.toDomain(rawJobWithUnpopulatedUser)).rejects.toThrow(NotFoundError);
        });
    });

    describe("toPersistence", () => {
        it("should convert a domain Job entity to a raw job object", () => {
            const raw = adapter.toPersistence(domainJob);

            expect(raw.company).toBe(domainJob.company);
            expect(raw.position).toBe(domainJob.position);
            expect(raw.status).toBe(domainJob.status);
            expect(raw.jobType).toBe(domainJob.jobType);
            expect(raw.location).toBe(domainJob.location);
            expect(raw.createdBy?.toString()).toBe(domainJob.createdBy.id.toString());
        });
    });
});