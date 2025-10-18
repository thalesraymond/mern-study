import { describe, it, expect } from 'vitest';
import { Entity } from '../../../src/domain/entities/Entity.js';
import { EntityId } from '../../../src/domain/entities/EntityId.js';

class ConcreteEntity extends Entity {
    constructor(props: { id?: EntityId; createdAt: Date; updatedAt: Date }) {
        super(props);
    }
}

describe('Entity', () => {
    it('should throw an error when accessing the id of an entity without an id', () => {
        const entity = new ConcreteEntity({ createdAt: new Date(), updatedAt: new Date() });
        expect(() => entity.id).toThrow('Entity ID not set');
    });

    it('should return the id of an entity with an id', () => {
        const id = new EntityId('60d5ec49e0d3f4a3c8d3e8b1');
        const entity = new ConcreteEntity({ id, createdAt: new Date(), updatedAt: new Date() });
        expect(entity.id).toBe(id);
    });
});
