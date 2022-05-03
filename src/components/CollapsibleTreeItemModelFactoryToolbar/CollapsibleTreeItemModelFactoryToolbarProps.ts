export interface CollapsibleTreeItemModelFactoryToolbarProps extends React.HTMLAttributes<HTMLElement> {
    itemsPerLevel: number[];
    onGenerateButtonClick: (itemsPerLevel: number[]) => void;
}
