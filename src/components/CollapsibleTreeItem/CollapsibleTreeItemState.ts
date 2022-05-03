import { CollapsibleTreeItemModel } from './CollapsibleTreeItemModel';

export interface CollapsibleTreeItemState {
    model: CollapsibleTreeItemModel;
    nestingLevel: number;
    id: string;
    label: string;
    showActionButtons: boolean;
}
