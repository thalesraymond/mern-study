import { Entity } from "../entities/Entity.js";
import { EntityId } from "../entities/EntityId.js";

export interface IRepository<T extends Entity> {
  listAll(): Promise<T[]>;
  getById(id: EntityId): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: EntityId): Promise<void>;
}
