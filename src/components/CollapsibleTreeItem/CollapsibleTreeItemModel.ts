import { isEmpty } from 'lodash';

export class CollapsibleTreeItemModel {
    private readonly _children: CollapsibleTreeItemModel[] = [];
    private _collapsed = true;

    constructor(
        public readonly id: string,
        public label: string,
        public parent: CollapsibleTreeItemModel | undefined
    ) {
        if (!!parent) {
            parent.addChildren([this]);
        }
    }

    public get isCollapsed(): boolean | undefined {
        return this.isCollapsible ? this._collapsed : undefined;
    }

    public get isCollapsible(): boolean {
        return !isEmpty(this._children);
    }

    public get isVisible(): boolean {
        return this.getAncestors().every((ancestor) => !ancestor.isCollapsed);
    }

    public toggleCollapsedState(): void {
        if (!this.isCollapsible) {
            console.error(`[CollapsibleTreeItemModel][toggleCollapsedState] Node (${this.id}) does not have children.`);

            return;
        }

        this._collapsed = !this._collapsed;

        if (!this._collapsed) {
            return;
        }

        // Collapse all children if they were expanded.
        this._children.forEach((child) => {
            if (child.isCollapsed === false) {
                child.toggleCollapsedState();
            }
        });
    }

    public addChildren(items: CollapsibleTreeItemModel[]): void {
        items.forEach((item) => (item.parent = this));
        this._children.push(...items);
    }

    public removeChild(item: CollapsibleTreeItemModel): void {
        const index = this._children.indexOf(item);

        if (index < 0) {
            console.error(`[CollapsibleTreeItemModel][removeChild] Node (${item.id}) does not belong to parent (${this.id}).`);

            return;
        }

        this._children.splice(index, 1);
    }

    public flatten(): CollapsibleTreeItemModel[] {
        const result: CollapsibleTreeItemModel[] = [this];

        this._children.forEach((child) => result.push(...child.flatten()));

        return result;
    }

    public getNestingLevel(): number {
        if (!this.parent) {
            return 0;
        }

        return this.parent.getNestingLevel() + 1;
    }

    public getChildren(): ReadonlyArray<CollapsibleTreeItemModel> {
        return this._children;
    }

    private getAncestors(): CollapsibleTreeItemModel[] {
        if (!this.parent) {
            return [];
        }

        return [this.parent, ...this.parent.getAncestors()];
    }
}
