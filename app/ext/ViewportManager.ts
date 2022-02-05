import StateManager from "../stateManager";

export type PanelHandle = {
    focus();
};

type PanelItem = {
    display: string,
    icon?: string,
    content: () => JSX.Element
};

export default class ViewportManager extends StateManager<{ left: PanelItem[], right: PanelItem[], left_focus: number, right_focus: number, viewport: () => JSX.Element }> {
    constructor() {
        super({
            left: [],
            right: [],
            left_focus: 0,
            right_focus: 0
        })
    }

    public addPanelItem(panel: { label: string, icon?: string }, content: () => JSX.Element): PanelHandle {
        this.setState(prev => ({ left: [...prev.left, { display: panel.label, icon: panel.icon, content: content }] }));

        return {
            focus: () => {
                this.setState(function (prev) {
                    const leftIndex = prev.left.findIndex(item => item.content === content);
                    const rightIndex = prev.right.findIndex(item => item.content === content);

                    if (leftIndex >= 0)
                        return {
                            left_focus: leftIndex
                        };
                    else if (rightIndex >= 0)
                        return {
                            right_focus: rightIndex
                        };

                    console.warn(`failed to focus ${panel.label} as it does not exist`);
                });
            }
        };
    }
}