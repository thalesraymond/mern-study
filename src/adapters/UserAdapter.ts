import Adapter from "./Adapter.js";
import User from "../domain/entities/User.js";
import { EntityId } from "../domain/entities/EntityId.js";
import Email from "../domain/entities/Email.js";

export default class UserAdapter extends Adapter<User> {
    public toDomain(raw: any): User {
        return new User({
            id: new EntityId(raw.id || raw._id.toString()),
            name: raw.name,
            lastName: raw.lastName,
            email: Email.create(raw.email),
            password: raw.password,
            location: raw.location,
        });
    }

    public toPersistence(user: User): any {
        return {
            _id: user.id?.toString(),
            name: user.name,
            lastName: user.lastName,
            email: user.email.toString(),
            password: user.password,
            location: user.location,
        };
    }
}
