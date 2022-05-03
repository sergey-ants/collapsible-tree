import { Component } from 'react';
import { CollapsibleTreeItem } from '../CollapsibleTreeItem/CollapsibleTreeItem';
import { CollapsibleTreeItemModel } from '../CollapsibleTreeItem/CollapsibleTreeItemModel';
import { VirtualScroll } from '../VirtualScroll/VirtualScroll';
import { VirtualScrollSettings } from '../VirtualScroll/VirtualScrollSettings';
import './CollapsibleTree.scss';
import { CollapsibleTreeProps } from './CollapsibleTreeProps';
import { CollapsibleTreeState } from './CollapsibleTreeState';

export class CollapsibleTree extends Component<CollapsibleTreeProps, CollapsibleTreeState> {
    public static VIRTUAL_SCROLL_SETTINGS: VirtualScrollSettings = {
        itemHeight: 20,
        amount: 20,
        tolerance: 2,
        minIndex: 0,
        startIndex: 0,
    };

    private _visibleViewportTopItemIndex = 0;

    private readonly _collapsibleTreeItemById = new Map<string, CollapsibleTreeItemModel>();

    private readonly handleRowTemplateRequest = (item: CollapsibleTreeItemModel): JSX.Element => {
        return (
            <CollapsibleTreeItem
                key={item.id}
                id={item.id}
                model={item}
                onBeforeCollapsedStateChange={this.handleCollapsedStateChange}
                onRemoveItem={this.handleRemoveCollapsibleItem}
                onAddNewItem={this.handleAddNewCollapsibleItem}
            />
        );
    };

    private readonly handleCollapsedStateChange = (item: CollapsibleTreeItemModel): void => {
        const firstChildIndex = this.findViewportVisibleItemIndex(item.id) + 1;
        const visibleItemIds = this.state.visibleItemIds;

        if (!item.isCollapsed) {
            const removedItemsCount = item.flatten().filter((child) => child.isVisible).length - 1;
            visibleItemIds.splice(firstChildIndex, removedItemsCount);
        } else {
            const childrenIds = item.getChildren().map((child) => child.id);
            visibleItemIds.splice(firstChildIndex, 0, ...childrenIds);
        }

        this.forceUpdate();
    };

    private readonly handleRemoveCollapsibleItem = (item: CollapsibleTreeItemModel): void => {
        if (!this._collapsibleTreeItemById.delete(item.id)) {
            console.error(`[CollapsibleTree][handleRemoveCollapsibleItem] Item with id (${item.id}) does not exist. Nothing to remove.`);

            return;
        }

        const visibleItemIds = this.state.visibleItemIds;
        const index = this.findViewportVisibleItemIndex(item.id);
        const removedItemsCount = item.flatten().filter((child) => child.isVisible).length;

        visibleItemIds.splice(index, removedItemsCount);

        this.forceUpdate();
    };

    private readonly handleAddNewCollapsibleItem = (item: CollapsibleTreeItemModel): void => {
        if (this._collapsibleTreeItemById.has(item.id)) {
            console.error(`[CollapsibleTree][handleAddNewCollapsibleItem] Item with id (${item.id}) already exist.`);

            return;
        }

        const parent = item.parent;

        if (!parent) {
            console.error(`[CollapsibleTree][handleAddNewCollapsibleItem] Item with id (${item.id}) does not have parent.`);

            return;
        }

        this._collapsibleTreeItemById.set(item.id, item);

        if (parent.isCollapsed) {
            return;
        }

        const visibleItemIds = this.state.visibleItemIds;
        const parentIndex = this.findViewportVisibleItemIndex(parent.id);
        const visibleChildren = parent.flatten().filter((child) => child.isVisible).length;

        // Visible children collection should already include a new item.
        visibleItemIds.splice(parentIndex + visibleChildren - 1, 0, item.id);

        this.forceUpdate();
    };

    private readonly handleElementCollectionRequest = (offset: number, limit: number): CollapsibleTreeItemModel[] => {
        const startIndex = Math.max(0, offset);
        const endIndex = Math.min(offset + limit - 1, this.state.visibleItemIds.length);

        this._visibleViewportTopItemIndex = startIndex;

        if (startIndex > endIndex) {
            return [];
        }

        return this.state.visibleItemIds.slice(startIndex, endIndex).map((id) => this._collapsibleTreeItemById.get(id) as CollapsibleTreeItemModel);
    };

    private findViewportVisibleItemIndex(id: string): number {
        return this.state.visibleItemIds.indexOf(id, this._visibleViewportTopItemIndex);
    }

    constructor(props: CollapsibleTreeProps) {
        super(props);

        this.state = {
            visibleItemIds: this.initVisibleCollapsibleItemIds(props.models),
        };
    }

    public render(): JSX.Element {
        return (
            <VirtualScroll
                className="viewport"
                maxItemsCount={this.getMaxItemsCount()}
                onElementsRequest={this.handleElementCollectionRequest}
                settings={CollapsibleTree.VIRTUAL_SCROLL_SETTINGS}
                onRowTemplateRequest={this.handleRowTemplateRequest}
            />
        );
    }

    public componentWillReceiveProps(props: CollapsibleTreeProps): void {
        if (!!props.models) {
            this._collapsibleTreeItemById.clear();

            this.setState(() => ({
                visibleItemIds: this.initVisibleCollapsibleItemIds(props.models),
            }));
        }
    }

    private initVisibleCollapsibleItemIds(items: CollapsibleTreeItemModel[]): string[] {
        const visibleItemId: string[] = [];

        items.forEach((item) => {
            item.flatten().forEach((flatItem) => {
                this._collapsibleTreeItemById.set(flatItem.id, flatItem);

                if (flatItem.isVisible) {
                    visibleItemId.push(flatItem.id);
                }
            });
        });

        return visibleItemId;
    }

    private getMaxItemsCount(): number {
        return this.state.visibleItemIds.length;
    }
}
