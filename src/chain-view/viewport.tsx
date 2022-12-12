import React from 'react';
import _ from 'lodash';

import type {Extension} from '#core/ext/Extension';

import type ChainComponent from '../circuit/chaincomponent';
import type Document from "../document/document";

// @ts-ignore
import glob from './glob.css';
import RenderComponent, {getPos} from './render/component';
import Wire from './render/wire';

import {StateMgr} from './ext';
import NoContents from "../../ui/components/no-contents";
import {ApiGenericComponent, RenderComponentProps, Wires} from "#core/api/resources";
import RenderWire from "./render/wire";
import {intersection, Point} from "./vector";

export type ComponentUserAction =
    'click'
    | 'dblclick'
    | 'activate'
    | 'select'
    | 'breakpoint'
    | 'connect'
    | 'disconnect'
    | 'delete';

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

export interface WireObj {
    dest: { chain: ChainComponent<any, any>, render: ApiGenericComponent },
    src: { chain: ChainComponent<any, any>, render: ApiGenericComponent },
    coords: Point[],
    inputIndex: number, // is number because terminals may be unnamed
    outputIndex: number // number because null-name
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

        StateMgr.on('transform', state => this.setState({pan: state.pan, zoom: state.zoom}));

        const onChange = this.props.extension.api().getNamespace('document').getSymbol<(handler: (doc: Document) => void) => void>('on-document-change');

        if (onChange)
            onChange(doc => this.forceUpdate());
    }

    render() {
        const {gridSize} = StateMgr.get();
        const doc = this.props.extension.api().getNamespace('document').getSymbol<() => Document>('get-current-document')?.() ?? null;

        if (doc) {
            const [x, y] = [Math.floor(this.state.pan[0]) + 0.5, Math.floor(this.state.pan[1]) + 0.5];
            const {selected} = StateMgr.get();

            return <svg ref={this.ref}
                        width={this.ref.current?.clientWidth ?? this.props.width}
                        height={this.ref.current?.clientHeight ?? this.props.height}

                        onWheel={e => StateMgr.dispatch('transform', prev => ({pan: [prev.pan[0] + e.deltaX, prev.pan[1] + e.deltaY]}))}

                        viewBox={`${x} ${y} ${this.ref.current?.clientWidth ?? this.props.width} ${this.ref.current?.clientHeight ?? this.props.height}`}>
                <style>{glob}</style>
                <g>
                    {doc.circuit.map((i, a) => <RenderComponent
                        inputs={i.inbound}
                        outputs={i.outbound}
                        pos={doc!.renderMap[a].position}
                        selected={selected.has(i)}
                        chain={i}
                        key={`input-${a}`}/>)}

                    {/*{_.chain(doc?.renderMap)*/}
                    {/*    .map((i, b) => _.chain(i?.wires as RenderComponentProps['wires'])*/}
                    {/*        .entries()*/}
                    {/*        .map(([a, i]) => i.map(j => ({*/}
                    {/*            dest: {*/}
                    {/*                chain: doc?.circuit[Number(a)],*/}
                    {/*                render: doc?.renderMap[Number(a)]*/}
                    {/*            },*/}
                    {/*            src: {*/}
                    {/*                chain: doc?.circuit[b],*/}
                    {/*                render: doc?.renderMap[b]*/}
                    {/*            },*/}
                    {/*            coords: j.coords,*/}
                    {/*            inputIndex: j.inputIndex,*/}
                    {/*            outputIndex: j.outputIndex,*/}
                    {/*        })))*/}
                    {/*        .value())*/}
                    {/*    .flatten()*/}
                    {/*    .flatten()*/}
                    {/*    .map(function (i) {*/}
                    {/*        const dest = getPos(i.dest.render.position).map(i => i * gridSize);*/}
                    {/*        const src = [...getPos(i.src.render.position), 1].map(i => i * gridSize);*/}

                    {/*        const output = new Point(src[0] + src[2], src[1] + gridSize * i.outputIndex + Math.floor(gridSize / 2));*/}
                    {/*        const input = new Point(dest[0], dest[1] + gridSize * i.inputIndex + Math.floor(gridSize / 2));*/}

                    {/*        const splice = function (coords: { x: number, y: number }) {*/}
                    {/*            const points = [output, i.coords, input];*/}

                    {/*            console.log(points);*/}

                    {/*            console.log("Splicing at", points.slice(1).find(function (i, a) {*/}
                    {/*                const slice = [points[a], i] as [Point, Point];*/}

                    {/*                if (intersection(slice, new Point(coords.x, coords.y), gridSize / 4))*/}
                    {/*                    return true;*/}
                    {/*            }));*/}
                    {/*        }*/}

                    {/*        return <RenderWire*/}
                    {/*            onSplice={e => splice({x: e.clientX, y: e.clientY})}*/}
                    {/*            points={i.coords}*/}
                    {/*            input={input.toTuple()}*/}
                    {/*            output={output.toTuple()}*/}
                    {/*            from={[i.src.chain, i.src.chain.outputLabels[i.outputIndex]]}*/}
                    {/*            to={[i.dest.chain, i.dest.chain.inputLabels[i.inputIndex]]}/>;*/}
                    {/*    })*/}
                    {/*    .value()}*/}
                </g>
            </svg>;
        } else
            return <NoContents/>;
    }
}
