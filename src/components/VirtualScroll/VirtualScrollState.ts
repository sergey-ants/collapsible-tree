import { VirtualScrollSettings } from './VirtualScrollSettings';

export interface VirtualScrollState<T> {
    settings: VirtualScrollSettings;
    maxItemsCount: number;
    viewportHeight: number;
    totalHeight: number;
    toleranceHeight: number;
    bufferHeight: number;
    bufferedItems: number;
    topPaddingHeight: number;
    topItemIndex: number;
    bottomPaddingHeight: number;
    initialPosition: number;
    data: T[];
}
