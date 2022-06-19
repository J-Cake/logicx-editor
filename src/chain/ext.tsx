import React from 'react';

import type { Extension } from '../../core/ext/Extension';
import StateManager from '../../core/stateManager';

import { ComponentUserAction, Viewport, Storage } from './viewport';
import ChainComponent from './chaincomponent';
import ToolButton from '../../ui/components/ToolButton';
import type { ActionItem } from '../../core/ext/ViewportManager';
import Document from "../document/document";

export const name = 'chain';

export const StateMgr = new StateManager<{
    zoom: number,
    pan: [number, number],
    grid: boolean,

    gridSize: number,
    snap: boolean,

    components: { [componentId in string]: ChainComponent<any[], any[]> },
    selected: Set<ChainComponent<any, any>>,

    extStorage: StateManager<Storage>,

    getValue: <T>(path: string) => T | null,

    document?: Document
}>({ zoom: 1, pan: [0, 0], gridSize: 35, grid: false, getValue: () => null, selected: new Set() });

export default function Ext(extension: Extension<Storage>) {
    const viewport = React.createRef<Viewport>();
    const { pan, zoom } = StateMgr.setState({ getValue: extension.currentTheme, extStorage: extension.storage() });

    const view = extension.action.fork('view');
    view.register('reset', () => StateMgr.dispatch('transform', prev => ({ pan: [0, 0], zoom: 1 })));
    view.register('zoom-in', () => StateMgr.dispatch('transform', prev => ({ pan: [0, 0], zoom: prev.zoom + 0.05 })));
    view.register('zoom-out', () => StateMgr.dispatch('transform', prev => ({
        pan: [0, 0],
        zoom: Math.max(0.05, prev.zoom - 0.05)
    })));
    // To set the tool bars
    extension.storage().setState({
        tools: ['chain.view.reset', 'chain.view.zoom-in', 'chain.view.zoom-out'],
        registeredTools: {},
        selectedTool: 'select'
    });

    // To register tools. Each tool is named by `name: string`, and is uniquely identifiable that way. Each tool has the option to intercept each event and perform actions as necessar
    extension.api().expose('register-tool', function (name: string): Record<ComponentUserAction, (handler: (component: ChainComponent<any, any>) => void) => void> {
        let handlers: Record<ComponentUserAction, Array<(component: ChainComponent<any, any>) => void>>;
        extension.storage().dispatch('register-tool', prev => ({
            registeredTools: {
                ...prev.registeredTools,
                [name]: handlers = {
                    click: [],
                    dblclick: [],
                    activate: [],
                    select: [],
                    breakpoint: [],
                    connect: [],
                    disconnect: [],
                    delete: [],
                }
            }
        }));

        return {
            click: handler => handlers['click'].push(handler),
            dblclick: handler => handlers['dblclick'].push(handler),
            activate: handler => handlers['activate'].push(handler),
            select: handler => handlers['select'].push(handler),
            breakpoint: handler => handlers['breakpoint'].push(handler),
            connect: handler => handlers['connect'].push(handler),
            disconnect: handler => handlers['disconnect'].push(handler),
            delete: handler => handlers['delete'].push(handler),
        }
    });

    // expose emit function and add to state mgr
    extension.api().expose('emit-event', extension.storage().setState({
        emitEvent(event: ComponentUserAction, component: ChainComponent<any, any>) {
            const { selectedTool, registeredTools } = extension.storage().get();

            if (selectedTool && registeredTools[selectedTool])
                for (const i of registeredTools[selectedTool][event])
                    i(component);
        }
    }).emitEvent);

    extension.api().expose("visible", []);

    extension.api().expose('select', {
        toggle(...items: ChainComponent<any, any>[]) {
            const selected = StateMgr.get().selected;
            for (const i of items)
                if (selected.has(i))
                    selected.delete(i);
                else
                    selected.add(i);

            viewport.current?.forceUpdate();
        },
        expand(...items: ChainComponent<any, any>[]) {
            StateMgr.get().selected.clear();
            for (const i of items)
                StateMgr.get().selected.add(i);
            viewport.current?.forceUpdate();
        },
        reduce(...items: ChainComponent<any, any>[]) {
            for (const i of items)
                StateMgr.get().selected.delete(i);
            viewport.current?.forceUpdate();
        },
        set(...items: ChainComponent<any, any>[]) {
            StateMgr.get().selected.clear();
            for (const i of items)
                StateMgr.get().selected.add(i);
            viewport.current?.forceUpdate();
        },
        clear() {
            StateMgr.get().selected.clear();
            viewport.current?.forceUpdate();
        }
    })

    // TODO: Figure out how to migrate to function component

    extension.ui.viewport(function (parent) {
        return <section id="document-editor">
            <div className={`toolbar top`}>
                {extension.storage().get().tools?.map((i: string) => extension.action.details(i)!).filter((i: ActionItem | null) => i).map((i: ActionItem, a: number) =>
                    <ToolButton key={Math.random()} action={i} onClick={() => i.invoke()} />)}
            </div>

            <Viewport ref={viewport} extension={extension as any} pan={pan} zoom={zoom} width={parent.width()!} height={parent.height()!} />
        </section>;
    });
}