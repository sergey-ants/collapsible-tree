import React, { Component } from 'react';
import { VirtualScrollProps } from './VirtualScrollProps';
import { VirtualScrollSettings } from './VirtualScrollSettings';
import { VirtualScrollState } from './VirtualScrollState';

export class VirtualScroll<T> extends Component<VirtualScrollProps<T>, VirtualScrollState<T>> {
    private readonly _viewportElement: React.RefObject<HTMLDivElement>;

    private readonly handleScroll = (event: React.UIEvent<HTMLElement, UIEvent>): void => {
        const { scrollTop } = event.target as HTMLElement;

        this.runScrollTo(scrollTop);
    };

    constructor(props: VirtualScrollProps<T>) {
        super(props);

        this.state = this.getInitialState(props);
        this._viewportElement = React.createRef();
    }

    public render(): JSX.Element {
        const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } = this.state;

        return (
            <div className="viewport" ref={this._viewportElement} onScroll={this.handleScroll} style={{ height: viewportHeight }}>
                <div style={{ height: topPaddingHeight }} />
                {data.map((dataItem: T) => this.props.onRowTemplateRequest(dataItem))}
                <div style={{ height: bottomPaddingHeight }} />
            </div>
        );
    }

    public componentDidMount(): void {
        const current = this._viewportElement.current;

        if (!current) {
            return;
        }

        current.scrollTop = this.state.initialPosition;

        if (!this.state.initialPosition || this.state.initialPosition <= 0) {
            this.runScrollTo(0);
        }
    }

    public componentWillReceiveProps(props: VirtualScrollProps<T>): void {
        if (props.maxItemsCount !== this.state.maxItemsCount) {
            this.setState(() => ({
                maxItemsCount: props.maxItemsCount,
                totalHeight: this.getTotalHeight(props.maxItemsCount),
            }));

            this.renderItemsFromIndex(this.state.topItemIndex);
        }
    }

    private runScrollTo(scrollTop: number): void {
        const {
            toleranceHeight,
            settings: { itemHeight, minIndex },
        } = this.state;

        const index = minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);

        this.renderItemsFromIndex(index);
    }

    private renderItemsFromIndex(index: number): void {
        const {
            totalHeight,
            bufferedItems,
            settings: { itemHeight, minIndex },
        } = this.state;

        const data = this.props.onElementsRequest(index, bufferedItems);
        const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
        const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * itemHeight, 0);

        this.setState(() => ({
            topPaddingHeight,
            bottomPaddingHeight,
            data,
            topItemIndex: index,
        }));
    }

    private getTotalHeight(maxItemsCount: number): number {
        const { itemHeight, minIndex } = this.state.settings;

        return (maxItemsCount - minIndex + 1) * itemHeight;
    }

    private getInitialState(props: VirtualScrollProps<T>): VirtualScrollState<T> {
        const { itemHeight, amount, tolerance, minIndex, startIndex } = props.settings;
        const viewportHeight = amount * itemHeight;
        const totalHeight = (props.maxItemsCount - minIndex + 1) * itemHeight;
        const toleranceHeight = tolerance * itemHeight;
        const bufferedItems = amount + 2 * tolerance;
        const bufferHeight = viewportHeight + 2 * toleranceHeight;
        const itemsAbove = startIndex - tolerance - minIndex;
        const topPaddingHeight = itemsAbove * itemHeight;
        const bottomPaddingHeight = totalHeight - topPaddingHeight;
        const initialPosition = topPaddingHeight;
        const topItemIndex = startIndex;

        return {
            settings: props.settings,
            maxItemsCount: props.maxItemsCount,
            viewportHeight,
            totalHeight,
            toleranceHeight,
            bufferHeight,
            bufferedItems,
            topItemIndex,
            topPaddingHeight,
            bottomPaddingHeight,
            initialPosition,
            data: [],
        };
    }
}
