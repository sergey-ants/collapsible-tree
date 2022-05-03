import { CollapsibleTreeItemModel } from '../CollapsibleTreeItem/CollapsibleTreeItemModel';
import words from 'random-words';
import { v4 as uuid } from 'uuid';
import { capitalize } from 'lodash';

interface CreateRandomItemsMethodOutputs {
    (count?: number): CreateRandomItemsMethodOutputs;
    getResult(): CollapsibleTreeItemModel[];
    getCurrentLevelItems(): CollapsibleTreeItemModel[];
}

export class CollapsibleTreeItemModelFactory {
    public static MAX_RANDOM_ITEMS_COUNT_PER_LEVEL_BY_DEFAULT = 10;

    /**
     * Creates a function to return collapsible tree item model collection with random names and ids.
     * The function itself can return wether all items in the requested nesting level or the whole collection starting from the root level.
     * @param {Number} count Number of items of the requested level. It will become random if inapplicable input are proposed.
     * @example
     * createRandomItems(5)(1).getResult(); // Return 5 items, each containing 1 subitem inside.
     * createRandomItems()(0).getResult(); // Return random count of items, each containin random count of subitems inside.
     * createRandomItems(5)(5).getCurrentLevelItems(); // Return all 25 subitems.
     */
    public static createRandomItems(count?: number): CreateRandomItemsMethodOutputs {
        return CollapsibleTreeItemModelFactory.createNestingRandomItems(count);
    }

    /**
     * Creates collapsible tree item model with random name and id.
     * @param {CollapsibleTreeItemModel} parentItem Parent tree node.
     */
    public static createRandomItem(parent?: CollapsibleTreeItemModel): CollapsibleTreeItemModel {
        return new CollapsibleTreeItemModel(uuid(), capitalize(words()), parent);
    }

    private static createNestingRandomItems(
        count?: number,
        parentItems?: CollapsibleTreeItemModel[],
        rootItems?: CollapsibleTreeItemModel[],
    ): CreateRandomItemsMethodOutputs {
        const items: CollapsibleTreeItemModel[] = [];
        const effectiveCount = !count ? Math.round(CollapsibleTreeItemModelFactory.MAX_RANDOM_ITEMS_COUNT_PER_LEVEL_BY_DEFAULT * Math.random()) : count;

        if (!!parentItems) {
            parentItems.forEach((parent) => {
                const currentLevelSubitems: CollapsibleTreeItemModel[] = [];

                for (let i = 0; i < effectiveCount; i++) {
                    currentLevelSubitems.push(CollapsibleTreeItemModelFactory.createRandomItem());
                }

                parent.addChildren(currentLevelSubitems);
                items.push(...currentLevelSubitems);
            });
        } else {
            for (let i = 0; i < effectiveCount; i++) {
                items.push(CollapsibleTreeItemModelFactory.createRandomItem());
            }
        }

        function createSubItems(subItemsCount?: number): CreateRandomItemsMethodOutputs {
            return CollapsibleTreeItemModelFactory.createNestingRandomItems(subItemsCount, items, rootItems ?? items);
        }

        createSubItems.getCurrentLevelItems = () => {
            return items;
        };

        createSubItems.getResult = () => {
            return rootItems ?? items;
        };

        return createSubItems;
    }
}
