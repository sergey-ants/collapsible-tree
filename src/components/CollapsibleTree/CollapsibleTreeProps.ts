import React from 'react';
import { CollapsibleTreeItemModel } from '../CollapsibleTreeItem/CollapsibleTreeItemModel';

export interface CollapsibleTreeProps extends React.HTMLAttributes<HTMLElement> {
    models: CollapsibleTreeItemModel[];
}
