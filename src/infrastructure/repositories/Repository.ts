import { Model } from "mongoose";
import { Entity } from "../../domain/entities/Entity.js";
import { EntityId } from "../../domain/entities/EntityId.js";
import { IRepository } from "../../domain/repositories/IRepository.js";
import Adapter from "../adapters/Adapter.js";
import NotFoundError from "../../errors/NotFoundError.js";

export default class Repository<
    TDomain extends Entity,
    TPersistence extends object,
> implements IRepository<TDomain>
{
    constructor(
        protected readonly model: Model<TPersistence>,
        protected readonly adapter: Adapter<TDomain, TPersistence>
    ) {}

    async listAll(): Promise<TDomain[]> {
        const documents = await this.model.find().populate({
            path: "createdBy",
            strictPopulate: false,
        });
        const results = await Promise.all(
            documents.map((doc) => this.adapter.toDomain(doc))
        );
        return results;
    }

    async getById(id: EntityId): Promise<TDomain | null> {
        const document = await this.model
            .findById(id.toString())
            .populate({
                path: "createdBy",
                strictPopulate: false,
            });
        if (!document) {
            return null;
        }
        return await this.adapter.toDomain(document);
    }

    async create(entity: TDomain): Promise<TDomain> {
        const persistenceEntity = this.adapter.toPersistence(entity);
        const document = await this.model.create(persistenceEntity);
        return await this.adapter.toDomain(document);
    }

    async update(entity: TDomain): Promise<TDomain> {
        let id;
        try {
            id = entity.id;
        } catch (error) {
            throw new Error("Entity must have an id to be updated");
        }
        const persistenceEntity = this.adapter.toPersistence(entity);
        const document = await this.model.findByIdAndUpdate(
            entity.id.toString(),
            persistenceEntity,
            { new: true }
        );
        if (!document) {
            throw new NotFoundError(
                `Entity with id ${entity.id.toString()} not found`
            );
        }
        return await this.adapter.toDomain(document);
    }

    async delete(id: EntityId): Promise<void> {
        await this.model.findByIdAndDelete(id.toString());
    }
}
