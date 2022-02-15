import $ from "jquery";

import { StateMgr } from "..";
import StateManager from "../stateManager";

export type PanelHandle = {
    focus();
    moveLeft();
    moveRight();
};

type PanelItem = {
    display: string,
    icon?: string,
    content: (panel: PanelHandle) => JSX.Element,
    handle: () => PanelHandle
};

export type ActionItem = {
    name: string,
    friendly?: string,
    icon?: string,
    shortcut?: string,
    enabled: boolean
};

interface ViewportManagerState {
    left: PanelItem[], 
    right: PanelItem[], 
    left_focus: number, 
    right_focus: number, 
    viewport: (parent: JQuery) => JSX.Element,

    LeftToolbar: ActionItem[],
    RightToolbar: ActionItem[],
    TopToolbar: ActionItem[],
}

export default class ViewportManager extends StateManager<ViewportManagerState> {
    constructor() {
        super({
            left: [],
            right: [],
            left_focus: 0,
            right_focus: 0,

            TopToolbar: [],
            LeftToolbar: [],
            RightToolbar: []
        });
    }

    public addPanelItem(panel: { label: string, icon?: string, panel?: 'left' | 'right' }, content: (panel: PanelHandle) => JSX.Element): PanelHandle {
        const p: PanelItem = {
            display: panel.label,
            icon: panel.icon,
            content: content,
            handle: () => ({
                focus: () => this.setState(function (prev) {
                    const leftIndex = prev.left.findIndex(item => item.content === content);
                    const rightIndex = prev.right.findIndex(item => item.content === content);

                    if (leftIndex >= 0)
                        return { left_focus: leftIndex };
                    else if (rightIndex >= 0)
                        return { right_focus: rightIndex };

                    console.warn(`failed to focus ${panel.label} as it does not exist`);
                }),

                moveLeft: () => this.dispatch('panel-move', prev => ({ left: prev.left.filter(i => i !== p).concat(p), right: prev.left.filter(i => i !== p) })),
                moveRight: () => this.dispatch('panel-move', prev => ({ right: prev.left.filter(i => i !== p).concat(p), left: prev.left.filter(i => i !== p) })),
            })
        };

        if (!panel.panel || panel.panel === 'left')
            this.setState(prev => ({ left: [...prev.left, p] }));
        else
            this.setState(prev => ({ right: [...prev.right, p] }));

        return p.handle();
    }
}