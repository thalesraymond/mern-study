import { Model } from 'mongoose';
import { Entity } from '../../domain/entities/Entity.js';
import { EntityId } from '../../domain/entities/EntityId.js';
import { IRepository } from '../../domain/repositories/IRepository.js';
import Adapter from '../../adapters/Adapter.js';
import NotFoundError from '../../errors/NotFoundError.js';

export default class Repository<T extends Entity> implements IRepository<T> {
    constructor(
        protected readonly model: Model<any>,
        protected readonly adapter: Adapter<T>
    ) {}

    async listAll(): Promise<T[]> {
        const documents = await this.model.find();
        const results = await Promise.all(documents.map(doc => this.adapter.toDomain(doc.toObject())));
        return results;
    }

    async getById(id: EntityId): Promise<T | null> {
        const document = await this.model.findById(id.toString());
        if (!document) {
            return null;
        }
        return await this.adapter.toDomain(document.toObject());
    }

    async create(entity: T): Promise<T> {
        const persistenceEntity = this.adapter.toPersistence(entity);
        const document = await this.model.create(persistenceEntity);
        return await this.adapter.toDomain(document.toObject());
    }

    async update(entity: T): Promise<T> {
        if (!entity.id) {
            throw new Error('Entity must have an id to be updated');
        }
        const persistenceEntity = this.adapter.toPersistence(entity);
        const document = await this.model.findByIdAndUpdate(
            entity.id.toString(),
            persistenceEntity,
            { new: true }
        );
        if (!document) {
            throw new NotFoundError(`Entity with id ${entity.id.toString()} not found`);
        }
        return await this.adapter.toDomain(document.toObject());
    }

    async delete(id: EntityId): Promise<void> {
        await this.model.findByIdAndDelete(id.toString());
    }
}
