import { HydratedDocument } from "mongoose";
import { Entity } from "../../domain/entities/Entity.js";

export default abstract class Adapter<
    TDomain extends Entity,
    TPersistence extends object,
> {
    public abstract toDomain(
        raw: HydratedDocument<TPersistence>
    ): TDomain | Promise<TDomain>;
    public abstract toPersistence(
        entity: TDomain
    ): TPersistence | Promise<TPersistence>;
}
