export class EntityId {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    const mongoIdRegex = /^[a-f\d]{24}$/i;
    if (!mongoIdRegex.test(value)) {
      throw new Error('Invalid Entity ID format');
    }
  }

  toString(): string {
    return this.value;
  }
}
