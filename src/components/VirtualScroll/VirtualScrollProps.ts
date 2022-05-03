import React from 'react';
import { VirtualScrollSettings } from './VirtualScrollSettings';

export interface VirtualScrollProps<T> extends React.HTMLAttributes<HTMLElement> {
    settings: VirtualScrollSettings;
    maxItemsCount: number;
    onRowTemplateRequest: (item: T) => JSX.Element;
    onElementsRequest: (offset: number, limit: number) => T[];
}
