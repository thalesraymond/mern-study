export default abstract class Entity {
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    protected constructor(props: { id: string; createdAt: Date; updatedAt: Date }) {
        this.id = props.id;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
