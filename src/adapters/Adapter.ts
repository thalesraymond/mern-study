import { Entity } from "../domain/entities/Entity.js";

export default abstract class Adapter<T extends Entity> {
    abstract toDomain(raw: any): T | Promise<T>;
    abstract toPersistence(entity: T): any;
}
