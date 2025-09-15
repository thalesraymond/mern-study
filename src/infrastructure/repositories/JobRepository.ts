import Job from "../../domain/entities/Job.js";
import JobModel from "../../models/JobModel.js";
import BaseRepository from "./BaseRepository.js";
import { Document } from "mongoose";

type JobDocument = Job & Document;

export default class JobRepository extends BaseRepository<Job> {
    constructor() {
        super(JobModel as any);
    }

    private toEntity(doc: JobDocument): Job {
        const job = new Job();
        job.id = doc.id;
        job.company = doc.company;
        job.position = doc.position;
        job.status = doc.status;
        job.jobType = doc.jobType;
        job.location = doc.location;
        job.createdAt = doc.createdAt;
        job.updatedAt = doc.updatedAt;
        return job;
    }

    public async create(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
        const newDoc = await this.model.create(data);
        return this.toEntity(newDoc as JobDocument);
    }

    public async findById(id: string): Promise<Job | null> {
        const doc = await this.model.findById(id).exec();
        return doc ? this.toEntity(doc as JobDocument) : null;
    }

    public async findAll(): Promise<Job[]> {
        const docs = await this.model.find().exec();
        return docs.map(doc => this.toEntity(doc as JobDocument));
    }

    public async update(id: string, data: Partial<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Job | null> {
        const updatedDoc = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        return updatedDoc ? this.toEntity(updatedDoc as JobDocument) : null;
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
