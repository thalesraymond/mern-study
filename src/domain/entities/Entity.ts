import { EntityId } from "./EntityId.js";

export abstract class Entity {
    private entityId?: EntityId;
    public get id(): EntityId {
        if (!this.entityId) {
            throw new Error("Entity ID not set");
        }

        return this.entityId;
    }

    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor({
        id,
        createdAt,
        updatedAt,
    }: {
        id?: EntityId;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.entityId = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
