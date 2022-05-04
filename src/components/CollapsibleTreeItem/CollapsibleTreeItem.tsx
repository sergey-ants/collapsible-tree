import { faCaretDown, faCaretUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { CollapsibleTreeItemModelFactory } from '../CollapsibleTreeItemModelFactoryToolbar/CollapsibleTreeItemModelFactory';
import { CollapsibleTreeItemModel } from './CollapsibleTreeItemModel';
import { CollapsibleTreeItemProps } from './CollapsibleTreeItemProps';
import { CollapsibleTreeItemState } from './CollapsibleTreeItemState';
import './CollapsibleTreeItem.scss';
import styleVariables from './CollapsibleTreeItemVariables.module.scss';

export class CollapsibleTreeItem extends Component<CollapsibleTreeItemProps, CollapsibleTreeItemState> {
    public static readonly LEFT_ITEM_OFFSET_PX = 30;

    private readonly handleAddNewItemButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();

        const item = CollapsibleTreeItemModelFactory.createRandomItem();

        this.model.addChildren([item]);
        this.props.onAddNewItem(item);

        this.forceUpdate();
    };

    private readonly handleRemoveItemButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();

        if (this.model.parent) {
            this.model.parent.removeChild(this.model);
        }

        this.props.onRemoveItem(this.model);

        this.forceUpdate();
    };

    private readonly handleMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();

        const itemElementCurrent = this._collapsibleTreeItemElement.current;
        const itemElementContentCurrent = this._collapsibleTreeItemContentElement.current;

        const showAddNewButton = !!itemElementCurrent && !!itemElementContentCurrent &&
            ((itemElementCurrent.offsetWidth - itemElementContentCurrent.offsetWidth) > 2 * Number(styleVariables.itemLevelOffset));

        this.setState(() => ({
            showActionButtons: true,
            showAddNewButton,
        }));
    };

    private readonly handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();

        this.setState(() => ({
            showActionButtons: false,
        }));
    };

    private readonly handleItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (event.defaultPrevented || !this.model.isCollapsible) {
            return;
        }

        this.props.onBeforeCollapsedStateChange(this.model);
        this.model.toggleCollapsedState();

        this.forceUpdate();
    };

    private readonly _collapsibleTreeItemElement: React.RefObject<HTMLDivElement>;
    private readonly _collapsibleTreeItemContentElement: React.RefObject<HTMLDivElement>;

    constructor(props: CollapsibleTreeItemProps) {
        super(props);

        this.state = {
            id: this.props.id,
            model: this.props.model,
            label: this.props.model.label,
            nestingLevel: this.props.model.getNestingLevel(),
            showActionButtons: false,
            showAddNewButton: false,
        };

        this._collapsibleTreeItemElement = React.createRef();
        this._collapsibleTreeItemContentElement = React.createRef();
    }

    public render(): JSX.Element {
        return (
            <div
                ref={this._collapsibleTreeItemElement}
                className={this.getCollapsibleTreeItemCssClasses()}
                key={this.state.id}
                onClick={this.handleItemClick}
                onMouseLeave={this.handleMouseLeave}
                onMouseEnter={this.handleMouseEnter}
            >
                <div
                    ref={this._collapsibleTreeItemContentElement}
                    className={this.getCollapsibleTreeItemContentCssClasses()}
                    title={this.state.label}
                >
                    {this.getItemIconTemplate()}
                    {this.state.label}
                </div>
                <div className={this.getActionButtonPanelCssClasses()}>
                    {this.state.showAddNewButton &&
                        <button className="action-button add-new-item-button" onClick={this.handleAddNewItemButtonClick} title="Add new item">
                            <FontAwesomeIcon className="icon" icon={faPlus} size="xs" />
                        </button>
                    }
                    <button className="action-button remove-item-button" onClick={this.handleRemoveItemButtonClick} title="Remove item">
                        <FontAwesomeIcon className="icon" icon={faTrash} size="xs" />
                    </button>
                </div>
            </div>
        );
    }

    public componentWillReceiveProps(props: CollapsibleTreeItemProps): void {
        if (props.id !== this.state.id) {
            this.setState(() => ({
                id: props.id,
                model: props.model,
                label: props.model.label,
                nestingLevel: props.model.getNestingLevel(),
            }));
        }
    }

    private get model(): CollapsibleTreeItemModel {
        return this.state.model;
    }

    private getItemIconTemplate(): JSX.Element | string {
        if (!this.model.isCollapsible) {
            return '';
        }

        const icon = this.model.isCollapsed ? faCaretDown : faCaretUp;

        return <FontAwesomeIcon className="icon" icon={icon} size="xs" />;
    }

    private getCollapsibleTreeItemCssClasses(): string {
        const classes = ['item'];

        if (this.model.isCollapsible) {
            classes.push('item__collapsible');
        }

        return classes.join(' ');
    }

    private getCollapsibleTreeItemContentCssClasses(): string {
        return ['item-content',  `item-content__nesting-level-${this.state.nestingLevel}`].join(' ');
    }

    private getActionButtonPanelCssClasses(): string {
        const classes = ['action-button-panel'];

        if (this.state.showActionButtons) {
            classes.push('action-button-panel__visible');
        }

        return classes.join(' ');
    }
}
