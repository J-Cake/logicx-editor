import $ from "jquery";
import React from 'react';
import dom from 'react-dom/client';

import {StateMgr} from "..";
import StateManager from "../stateManager";

export type PanelHandle = {
    focus(): void;
    moveLeft(): void;
    moveRight(): void;
};

type PanelItem = {
    display: string,
    icon?: string,
    content: (panel: PanelHandle) => JSX.Element,
    handle: () => PanelHandle
};

type StatusbarItem = {
    icon?: string,
    display: string,
    content: () => JSX.Element
};

export type ActionItem = {
    name: string,
    friendly?: string,
    icon?: string,
    shortcut?: string,
    enabled: boolean,
    invoke: () => void
};

interface ViewportManagerState {
    left: PanelItem[],
    right: PanelItem[],
    left_focus: number,
    right_focus: number,
    viewport: Record<string, (parent: JQuery) => JSX.Element>,
    // viewport: (parent: JQuery) => JSX.Element,

    LeftToolbar: ActionItem[],
    RightToolbar: ActionItem[],
    TopToolbar: ActionItem[],

    Statusbar: { left: StatusbarItem[], right: StatusbarItem[] };

    activeMenus: Array<() => void>
}

export default class ViewportManager extends StateManager<ViewportManagerState> {
    constructor() {
        super({
            left: [],
            right: [],
            left_focus: 0,
            right_focus: 0,

            viewport: {},

            TopToolbar: [],
            LeftToolbar: [],
            RightToolbar: [],
            Statusbar: {
                left: [],
                right: []
            },

            activeMenus: []
        });

        window.addEventListener('error', err => {
            this.setState(prev => ({
                Statusbar: {
                    ...prev.Statusbar,
                    right: [
                        ...prev.Statusbar.right,
                        {
                            content: () => <span>{err.message}</span>,
                            display: err.message,
                            icon: ''
                        }
                    ]
                }
            }));
            return false;
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
                        return {left_focus: leftIndex};
                    else if (rightIndex >= 0)
                        return {right_focus: rightIndex};

                    console.warn(`failed to focus ${panel.label} as it does not exist`);

                    return {};
                }),

                moveLeft: () => this.dispatch('panel-move', prev => ({
                    left: prev.left.filter(i => i !== p).concat(p),
                    right: prev.left.filter(i => i !== p)
                })),
                moveRight: () => this.dispatch('panel-move', prev => ({
                    right: prev.left.filter(i => i !== p).concat(p),
                    left: prev.left.filter(i => i !== p)
                })),
            })
        };

        if (!panel.panel || panel.panel === 'left')
            this.setState(prev => ({left: [...prev.left, p]}));
        else
            this.setState(prev => ({right: [...prev.right, p]}));

        return p.handle();
    }

    public menu(menu: JSX.Element): () => void {
        const container: JQuery<HTMLElement> = $(document.createElement('section'))
            .attr('tabindex', -1)
            .addClass('menu-container')
            .appendTo('#menu-root')
            // .on('focusout', () => !container.is(':focus-within') && container.remove());

        dom.createRoot(container[0])
            .render(menu);

        for (const i of this.get().activeMenus)
            i();

        let close: () => void;
        this.setState(prev => ({
            activeMenus: [...prev.activeMenus, close = () => {
                container.remove();
                this.setState(prev => ({
                    activeMenus: prev.activeMenus.filter(i => i != close)
                }));
            }]
        }))

        let mup: any, kdown: any;

        window.addEventListener('mouseup', mup = function () {
            if (container.is(':hover'))
                return;

            container.remove();
            window.removeEventListener('mouseup', mup);
            window.removeEventListener('keydown', kdown);
        });

        window.addEventListener('keydown', kdown = function (e: KeyboardEvent) {
            if (e.key != 'Escape')
                return;

            container.remove();
            window.removeEventListener('mouseup', mup);
            window.removeEventListener('mousedown', kdown);
        });

        return close!;
    }
}