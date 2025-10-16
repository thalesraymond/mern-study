import { describe, it, expect } from 'vitest';
import Job, { JobStatus, JobType } from '../../../src/domain/entities/Job.js';
import User from '../../../src/domain/entities/User.js';
import { EntityId } from '../../../src/domain/entities/EntityId.js';
import Email from '../../../src/domain/entities/Email.js';
import UserRole from '../../../src/domain/entities/UserRole.js';
import UserPassword from '../../../src/domain/entities/UserPassword.js';

describe('Job', () => {
  const mockUser = new User({
    name: 'Test User',
    email: Email.create('test@example.com'),
    password: UserPassword.createFromHashed('hashedPassword'),
    role: UserRole.USER,
    lastName: 'Last Name',
    location: 'Location',
    id: new EntityId('60d5ec49e0d3f4a3c8d3e8b1'),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const jobData = {
    company: 'Test Company',
    position: 'Test Position',
    status: JobStatus.PENDING,
    jobType: JobType.FULL_TIME,
    location: 'Test Location',
    createdBy: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid Job', () => {
    const job = new Job(jobData);
    expect(job).toBeInstanceOf(Job);
    expect(job.company).toBe(jobData.company);
  });

  it('should throw an error if company is missing', () => {
    const data = { ...jobData, company: '' };
    expect(() => new Job(data)).toThrow('company is required');
  });

  it('should throw an error if position is missing', () => {
    const data = { ...jobData, position: '' };
    expect(() => new Job(data)).toThrow('position is required');
  });

  it('should throw an error if location is missing', () => {
    const data = { ...jobData, location: '' };
    expect(() => new Job(data)).toThrow('location is required');
  });

  it('should throw an error if createdBy is missing', () => {
    const data = { ...jobData, createdBy: undefined as any };
    expect(() => new Job(data)).toThrow('createdBy is required');
  });
});