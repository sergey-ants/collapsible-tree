import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { CollapsibleTree } from '../CollapsibleTree/CollapsibleTree';
import { CollapsibleTreeItemModel } from '../CollapsibleTreeItem/CollapsibleTreeItemModel';
import { CollapsibleTreeItemModelFactory } from '../CollapsibleTreeItemModelFactoryToolbar/CollapsibleTreeItemModelFactory';
import { CollapsibleTreeItemModelFactoryToolbar } from '../CollapsibleTreeItemModelFactoryToolbar/CollapsibleTreeItemModelFactoryToolbar';
import { CollapsibleTreeTestWidgetState } from './CollapsibleTreeTestWidgetState';

export class CollapsibleTreeTestWidget extends Component<React.HTMLAttributes<HTMLElement>, CollapsibleTreeTestWidgetState> {
    public static readonly DEFAULT_COLLAPSIBLE_TREE_FACTORY_SETTINGS = [50000, 2, 2];

    private readonly handleGenerateButtonClick = (itemsPerLevel: number[]): void => {
        this.setState(() => ({
            models: this.createCollapsibleTreeItemModels(itemsPerLevel),
        }));
    };

    constructor(props: React.HTMLAttributes<HTMLElement>) {
        super(props);

        this.state = {
            models: this.createCollapsibleTreeItemModels(CollapsibleTreeTestWidget.DEFAULT_COLLAPSIBLE_TREE_FACTORY_SETTINGS),
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <CollapsibleTreeItemModelFactoryToolbar
                    itemsPerLevel={CollapsibleTreeTestWidget.DEFAULT_COLLAPSIBLE_TREE_FACTORY_SETTINGS}
                    onGenerateButtonClick={this.handleGenerateButtonClick}
                />
                <CollapsibleTree models={this.state.models} />
            </div>
        );
    }

    private createCollapsibleTreeItemModels(itemsPerLevel: number[]): CollapsibleTreeItemModel[] {
        if (isEmpty(itemsPerLevel)) {
            return [];
        }

        return itemsPerLevel
            .reduce((createRandomItemsForLevel, currentValue, currentIndex) => {
                if (currentIndex === 0) {
                    return createRandomItemsForLevel;
                }

                return createRandomItemsForLevel(currentValue);
            }, CollapsibleTreeItemModelFactory.createRandomItems(itemsPerLevel[0]))
            .getResult();
    }
}
