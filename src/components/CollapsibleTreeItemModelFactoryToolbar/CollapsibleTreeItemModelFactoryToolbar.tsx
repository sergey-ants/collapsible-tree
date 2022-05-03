import React, { Component } from 'react';
import { CollapsibleTreeItemModelFactoryToolbarProps } from './CollapsibleTreeItemModelFactoryToolbarProps';
import { CollapsibleTreeItemModelFactoryToolbarState } from './CollapsibleTreeItemModelFactoryToolbarState';
import './CollapsibleTreeItemModelFactoryToolbar.scss';

export class CollapsibleTreeItemModelFactoryToolbar extends Component<
    CollapsibleTreeItemModelFactoryToolbarProps,
    CollapsibleTreeItemModelFactoryToolbarState
> {
    private readonly handleAddNewLevelButtonCLick = (): void => {
        const itemsPerLevel = this.state.itemsPerLevel;
        itemsPerLevel.push(1);

        this.forceUpdate();
    };

    private readonly handleRemoveLastLevelButtonClick = (): void => {
        const itemsPerLevel = this.state.itemsPerLevel;
        itemsPerLevel.pop();

        this.forceUpdate();
    };

    private readonly handleGenerateButtonClick = (): void => {
        this.props.onGenerateButtonClick(this.state.itemsPerLevel);
    };

    private readonly handleInputChange = (index: number, event: React.FormEvent<HTMLInputElement>): void => {
        const value = Number((event.target as HTMLInputElement).value);
        const itemsPerLevel = this.state.itemsPerLevel;
        itemsPerLevel[index] = isNaN(value) ? 1 : value;

        this.forceUpdate();
    };

    constructor(props: CollapsibleTreeItemModelFactoryToolbarProps) {
        super(props);

        this.state = {
            itemsPerLevel: this.props.itemsPerLevel,
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.state.itemsPerLevel.map((value: number, index: number) => this.getNestingLevelInputTemplate(value, index))}
                {this.state.itemsPerLevel.length > 1 && <button onClick={this.handleRemoveLastLevelButtonClick}>Remove</button>}
                <button onClick={this.handleAddNewLevelButtonCLick}>Add</button>
                <button onClick={this.handleGenerateButtonClick}>Generate</button>
            </div>
        );
    }

    private getNestingLevelInputTemplate(value: number, index: number): JSX.Element {
        // tslint:disable:jsx-no-lambda
        return <input
            className='nesting-level-input'
            type="text"
            key={index}
            pattern="[0-9]*"
            onInput={(event) => this.handleInputChange(index, event)}
            value={value}
        />;
        // tslint:enable:jsx-no-lambda
    }
}
