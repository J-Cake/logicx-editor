import React from 'react';

// @ts-ignore
import glob from './glob.css';
import ChainComponent from './chaincomponent';
import Document from "../document/document";
import RenderComponent from './render/component';
import Wire from './render/wire';
import type { Extension } from '../../core/ext/Extension';

import { StateMgr } from './ext';

export type ComponentUserAction = 'click' | 'dblclick' | 'activate' | 'select' | 'breakpoint' | 'connect' | 'disconnect' | 'delete';
export interface Storage {
    tools: string[],
    registeredTools: { [key: string]: Record<ComponentUserAction, Array<(component: ChainComponent<any, any>) => void>> },
    selectedTool: string,
    emitEvent: (event: ComponentUserAction, component: ChainComponent<any, any>) => void,
}

export class Viewport extends React.Component<{ extension: Extension<Storage>, pan: [number, number], zoom: number, width: number, height: number }, { pan: [number, number], zoom: number }> {

    private updateTimeout?: number;
    private readonly ref = React.createRef<SVGSVGElement>();

    state = { pan: [0, 0] as [number, number], zoom: 1 };

    componentDidMount() {
        ChainComponent.onUpdate = () => this.updateTimeout ?? (this.updateTimeout = window.setTimeout(() => (this.forceUpdate(), delete this.updateTimeout), 1000 / 60));

        StateMgr.on('transform', state => this.setState({ pan: state.pan, zoom: state.zoom }));

        const docNs = this.props.extension.api().getNamespace('document');

        docNs.getSymbol<(handler: (doc: Document) => void) => void>('on-request-document-change')?.((doc?: Document) => StateMgr.dispatch('document-change', { document: doc }));
        StateMgr.setState({ document: docNs.getSymbol<Document>('document.get-open-document') ?? undefined });

        window.setTimeout(() => this.forceUpdate());

        StateMgr.on('document-change', state => this.forceUpdate());
    }

    private doc(): JSX.Element {
        const { document, selected } = StateMgr.get();

        if (document)
            return <g>
                {document.components.map((i, a) => <RenderComponent
                    inputs={i.inbound}
                    outputs={i.outbound}
                    pos={document.apiComponent[a].position}
                    selected={selected.has(i)}
                    chain={i}
                    key={`input-${a}`} />)}
                {document.wires.map((i, a) => <Wire points={i.points} from={i.from} to={i.to}></Wire>)}
            </g>
        else
            return <g>
                <text x='50%' y='50%' dominantBaseline='middle' textAnchor='middle'>No Document loaded</text>
            </g>;
    }

    render() {
        const [x, y] = [Math.floor(this.state.pan[0]) + 0.5, Math.floor(this.state.pan[1]) + 0.5];

        return <svg ref={this.ref}
            width={this.ref.current?.clientWidth ?? this.props.width}
            height={this.ref.current?.clientHeight ?? this.props.height}

            onWheel={e => StateMgr.dispatch('transform', prev => ({ pan: [prev.pan[0] + e.deltaX, prev.pan[1] + e.deltaY] }))}

            viewBox={`${x} ${y} ${this.ref.current?.clientWidth ?? this.props.width} ${this.ref.current?.clientHeight ?? this.props.height}`}>
            <style>{glob}</style>

            {React.createElement(this.doc.bind(this)) /* Just so I don't have to create a new functional component. You can use class members for this */}
        </svg>;
    }
}