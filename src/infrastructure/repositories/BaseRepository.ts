import { Model } from "mongoose";

export default abstract class BaseRepository<T> {
    protected constructor(protected readonly model: Model<T>) {}
}
