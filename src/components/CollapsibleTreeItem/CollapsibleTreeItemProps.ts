import React from 'react';
import { CollapsibleTreeItemModel } from './CollapsibleTreeItemModel';

export interface CollapsibleTreeItemProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
    model: CollapsibleTreeItemModel;
    onBeforeCollapsedStateChange: (item: CollapsibleTreeItemModel) => void;
    onRemoveItem: (item: CollapsibleTreeItemModel) => void;
    onAddNewItem: (item: CollapsibleTreeItemModel) => void;
}
