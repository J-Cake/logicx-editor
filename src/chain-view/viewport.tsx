import React from 'react';

import type { Extension } from '../../core/ext/Extension';

import type ChainComponent from '../circuit/chaincomponent';
import type Document from "../document/document";

// @ts-ignore
import glob from './glob.css';
import RenderComponent from './render/component';
import Wire from './render/wire';

import { StateMgr } from './ext';
import NoContents from "../../ui/components/no-contents";

export type ComponentUserAction = 'click' | 'dblclick' | 'activate' | 'select' | 'breakpoint' | 'connect' | 'disconnect' | 'delete';
export interface Storage {
    tools: string[],
    registeredTools: { [key: string]: Record<ComponentUserAction, Array<(component: ChainComponent<any, any>) => void>> },
    selectedTool: string,
    emitEvent: (event: ComponentUserAction, component: ChainComponent<any, any>) => void,
}

export interface ViewportProps {
    extension: Extension<Storage>,
    pan: [number, number],
    zoom: number,
    width: number,
    height: number
}

export interface ViewportState {
    pan: [number, number],
    zoom: number,
}

export class Viewport extends React.Component<ViewportProps, ViewportState> {

    private updateTimeout?: number;
    private readonly ref = React.createRef<SVGSVGElement>();

    constructor(props: ViewportProps) {
        super(props);
        this.state = {
            pan: [0, 0] as [number, number],
            zoom: 1,
        };

        StateMgr.on('transform', state => this.setState({ pan: state.pan, zoom: state.zoom }));

        const onChange = this.props.extension.api().getNamespace('circuit').getSymbol<(handler: (doc: Document) => void) => void>('on-document-change');

        if (onChange)
            onChange(doc => this.forceUpdate());
    }

    render() {
        const doc = this.props.extension.api().getNamespace('circuit').getSymbol<() => Document>('get-current-document')?.() ?? null;

        if (doc) {
            const [x, y] = [Math.floor(this.state.pan[0]) + 0.5, Math.floor(this.state.pan[1]) + 0.5];
            const { selected } = StateMgr.get();

            return <svg ref={this.ref}
                width={this.ref.current?.clientWidth ?? this.props.width}
                height={this.ref.current?.clientHeight ?? this.props.height}

                onWheel={e => StateMgr.dispatch('transform', prev => ({ pan: [prev.pan[0] + e.deltaX, prev.pan[1] + e.deltaY] }))}

                viewBox={`${x} ${y} ${this.ref.current?.clientWidth ?? this.props.width} ${this.ref.current?.clientHeight ?? this.props.height}`}>
                <style>{glob}</style>

                <g>
                    {doc.components.map((i, a) => <RenderComponent
                        inputs={i.inbound}
                        outputs={i.outbound}
                        pos={doc!.apiComponent[a].position}
                        selected={selected.has(i)}
                        chain={i}
                        key={`input-${a}`} />)}
                    {doc.wires.map((i, a) => <Wire points={i.points} from={i.from} to={i.to}></Wire>)}
                </g>
            </svg>;
        } else
            return <NoContents/>;
    }
}