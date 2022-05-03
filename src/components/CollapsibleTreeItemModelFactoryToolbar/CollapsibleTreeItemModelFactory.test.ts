import { CollapsibleTreeItemModelFactory } from './CollapsibleTreeItemModelFactory'

describe('[CollapsibleTreeItemModelFactory]', () => {
    it('[createRandomItem]: should create item', () => {
        const item = CollapsibleTreeItemModelFactory.createRandomItem();

        expect(item.id).toBeDefined();
        expect(item.label).toBeDefined();
        expect(item.parent).toBeUndefined();
    });

    it('[createRandomItem]: created item should contain parent', () => {
        const parent = CollapsibleTreeItemModelFactory.createRandomItem();
        const item = CollapsibleTreeItemModelFactory.createRandomItem(parent);

        expect(item.parent).toBe(parent);
        expect(parent.getChildren()).toContain(item);
    });

    it('[createRandomItems]: should return purposed count of items', () => {
        const generator = CollapsibleTreeItemModelFactory.createRandomItems(5)(5);

        expect(generator.getCurrentLevelItems().length === 25).toBeTruthy();
        expect(generator.getResult().length === 5).toBeTruthy();
    });

    it('[createRandomItems]: should return items with unique ids', () => {
        const generator = CollapsibleTreeItemModelFactory.createRandomItems(5)(5);

        const result = generator.getResult();
        const flatItems = [...result.map(item => item.flatten())];
        const areItemsUnique = (items: CollapsibleTreeItemModelFactory) => Array.isArray(items) && new Set(items).size === items.length;

        expect(areItemsUnique(flatItems)).toBeTruthy();
    });

    it('[createRandomItems]: empty size input should return random count of items', () => {
        const generator = CollapsibleTreeItemModelFactory.createRandomItems();

        expect(generator.getCurrentLevelItems().length > 0).toBeTruthy();
        expect(generator.getResult().length > 0).toBeTruthy();
    });

    it('[createRandomItems]: zero size input should return random count of items', () => {
        const generator = CollapsibleTreeItemModelFactory.createRandomItems(0);

        expect(generator.getCurrentLevelItems().length > 0).toBeTruthy();
        expect(generator.getResult().length > 0).toBeTruthy();
    });
});
