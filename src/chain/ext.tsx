import React from 'react';

import type { Extension } from '../../core/ext/Extension';
import StateManager from '../../core/stateManager';

import RenderComponent from './render/component';

// @ts-ignore
import glob from './glob.css';
import ChainComponent from './chaincomponent';
import Wire from './render/wire';
import Stateless, { TruthTable } from './stateless';
import ToolButton from '../../ui/components/ToolButton';
import type { ActionItem } from '../../core/ext/ViewportManager';
import Document from "../document/document";

export const name = 'chain';

export type ComponentUserAction = 'click' | 'dblclick' | 'activate' | 'select' | 'breakpoint' | 'connect' | 'disconnect' | 'delete';

interface Storage {
    tools: string[],
    actions: Partial<Record<ComponentUserAction, Array<(component: RenderComponent) => void>>>;
}

export const StateMgr = new StateManager<{
    zoom: number,
    pan: [number, number],
    grid: boolean,

    gridSize: number,
    snap: boolean,

    components: { [componentId in string]: ChainComponent<any[], any[]> },

    extStorage: StateManager<Storage>,

    getValue: <T>(path: string) => T | null,

    document?: Document
}>({ zoom: 1, pan: [0, 0], gridSize: 35, grid: false, getValue: () => null });

export default function Ext(extension: Extension<Storage>) {
    const { pan, zoom } = StateMgr.setState({ getValue: extension.currentTheme, extStorage: extension.storage() });

    const view = extension.action.fork('view');
    view.register('reset', () => StateMgr.dispatch('transform', prev => ({ pan: [0, 0], zoom: 1 })));
    view.register('zoom-in', () => StateMgr.dispatch('transform', prev => ({ pan: [0, 0], zoom: prev.zoom + 0.05 })));
    view.register('zoom-out', () => StateMgr.dispatch('transform', prev => ({
        pan: [0, 0],
        zoom: Math.max(0.05, prev.zoom - 0.05)
    })));
    extension.storage().setState({
        tools: ['chain.view.reset', 'chain.view.zoom-in', 'chain.view.zoom-out'],
        actions: {}
    });

    const addHandler = function (event: ComponentUserAction): ((handler: (component: RenderComponent) => void) => void) {
        return function (handler: (component: RenderComponent) => void) {
            const allActions: Storage['actions'] = extension.storage().get().actions;
            allActions[event] = (allActions[event] || []).concat(handler);
            extension.storage().setState({ actions: allActions });
        }
    };

    extension.api().expose("on", {
        click: addHandler('click'),
        dblclick: addHandler('dblclick'),
        activate: addHandler('activate'),
        select: addHandler('select'),
        breakpoint: addHandler('breakpoint'),
        connect: addHandler('connect'),
        disconnect: addHandler('disconnect'),
        delete: addHandler('delete'),
    });
    extension.api().expose("visible", []);

    // TODO: Figure out how to migrate to function component
    class Viewport extends React.Component<{ pan: [number, number], zoom: number, width: number, height: number }, { pan: [number, number], zoom: number }> {

        private updateTimeout?: number;
        private readonly ref = React.createRef<SVGSVGElement>();

        state = { pan: [0, 0] as [number, number], zoom: 1 };

        componentDidMount() {
            ChainComponent.onUpdate = () => this.updateTimeout ?? (this.updateTimeout = window.setTimeout(() => (this.forceUpdate(), delete this.updateTimeout), 1000 / 60));

            StateMgr.on('transform', state => this.setState({ pan: state.pan, zoom: state.zoom }));

            const docNs = extension.api().getNamespace('document');

            docNs.getSymbol<(handler: (doc: Document) => void) => void>('on-request-document-change')?.((doc?: Document) => StateMgr.dispatch('document-change', { document: doc }));
            StateMgr.setState({ document: docNs.getSymbol<Document>('document.get-open-document') ?? undefined });

            window.setTimeout(() => this.forceUpdate());

            StateMgr.on('document-change', state => this.forceUpdate());
        }

        private noDoc(): JSX.Element {
            const width = this.ref.current?.clientWidth ?? this.props.width;
            const height = this.ref.current?.clientHeight ?? this.props.height;

            const x = this.state.pan[0] + width / 2;
            const y = this.state.pan[1] + height / 2;

            return <g>
                <text x='50%' y='50%' dominantBaseline='middle' textAnchor='middle'>No Document loaded</text>
            </g>
        }

        private doc(): JSX.Element {
            const { document } = StateMgr.get();

            if (document)
                return <g>

                </g>
            else
                return React.createElement(this.noDoc.bind(this));
        }

        render() {
            const [x, y] = [Math.floor(this.state.pan[0]) + 0.5, Math.floor(this.state.pan[1]) + 0.5];

            return <svg ref={this.ref}
                width={this.ref.current?.clientWidth ?? this.props.width}
                height={this.ref.current?.clientHeight ?? this.props.height}

                onWheel={e => StateMgr.dispatch('transform', prev => ({ pan: [prev.pan[0] + e.deltaX, prev.pan[1] + e.deltaY] }))}

                viewBox={`${x} ${y} ${this.ref.current?.clientWidth ?? this.props.width} ${this.ref.current?.clientHeight ?? this.props.height}`}>
                <style>{glob}</style>

                {React.createElement(this.doc.bind(this))}

                {/* Replace with a real value extracted from the document. */}
                {/* {state.document?.components.map(i => <RenderComponent inputs={{}} outputs={{}} pos={[0, 0]} />)} */}

                {/* <RenderComponent outputs={inputs[0].outbound} inputs={inputs[0].inbound} pos={[0, 0]} label='test'*/}
                {/*                 key={'input-0'} onActivate={() => inputs[0].toggle()}/>*/}
                {/*<RenderComponent outputs={inputs[1].outbound} inputs={inputs[1].inbound} pos={[0, 1]} label='test'*/}
                {/*                 key={'input-1'} onActivate={() => inputs[1].toggle()}/>*/}
                {/*<RenderComponent outputs={and.outbound} inputs={and.inbound} pos={[4, 0]} label='test' key={'and'}/>*/}
                {/*<Wire points={[[0, 0], [4, 0]]} from={[inputs[0], 'input']} to={[and, 'a']}/>*/}
                {/*<Wire points={[[0, 1], [4, 1]]} from={[inputs[1], 'input']} to={[and, 'b']}/> */}
            </svg>;
        }
    }

    extension.ui.viewport(function (parent) {
        return <section id="document-editor">
            <div className={`toolbar top`}>
                {extension.storage().get().tools?.map(i => extension.action.details(i)!).filter(i => i).map((i: ActionItem, a) =>
                    <ToolButton key={Math.random()} action={i} onClick={() => i.invoke()} />)}
            </div>

            <Viewport pan={pan} zoom={zoom} width={parent.width()!} height={parent.height()!} />
        </section>;
    });
}