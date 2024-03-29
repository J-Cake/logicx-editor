import React from 'react';

import { Colour } from '#core/ext/ThemeManager';

import type ChainComponent from "../../circuit/chaincomponent";

import { StateMgr } from '../ext';
import {Point} from "../vector";

export interface Wire {
    points: Point[],
    from: [comp: ChainComponent<any[], any[]>, terminal: string],
    to: [comp: ChainComponent<any[], any[]>, terminal: string],
    input: [number, number],
    output: [number, number],

    onSplice(event: React.MouseEvent<SVGPolylineElement, MouseEvent>): void
}

export default function RenderWire(props: Wire) {
    const { getValue } = StateMgr.get();

    const active = getValue<Colour>('colours.primary');
    const base = getValue<Colour>('colours.foreground');

    return <polyline
        onClick={e => props.onSplice(e)}
        stroke={props.from[0].outbound[props.from[1]] ? active!.stringify() : base!.stringify()}
        points={toPath(props.points.map(i => i.toTuple()), props.output, props.input)}/>
}

export function toPath(points: [x: number, y: number][], output: [number, number], input: [number, number]): string {
    const { gridSize } = StateMgr.get();
    const segments: string[] = [];

    segments.push(`${output[0]},${output[1]}`);
    for (const i of points)
        segments.push(`${i[0] * gridSize + Math.floor(gridSize / 2)},${i[1] * gridSize + Math.floor(gridSize / 2)}`);
    segments.push(`${input[0]},${input[1]}`);

    return segments.join(' ');
}