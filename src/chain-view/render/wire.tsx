import React from 'react';

import { Colour } from '#core/ext/ThemeManager';

import type ChainComponent from "../../circuit/chaincomponent";

import { StateMgr } from '../ext';

export type Wire = {
    points: [x: number, y: number][],
    from: [comp: ChainComponent<any[], any[]>, terminal: string],
    to: [comp: ChainComponent<any[], any[]>, terminal: string]
};
export default function RenderWire(props: Wire) {
    const { getValue } = StateMgr.get();

    const active = getValue<Colour>('colours.primary');
    const base = getValue<Colour>('colours.foreground');

    // return <path stroke={props.from[0].outbound[props.from[1]] ? active!.stringify() : base!.stringify()} d={toPath([...props.points])} />;
    return <polyline stroke={props.from[0].outbound[props.from[1]] ? active!.stringify() : base!.stringify()} points={toPath([...props.points])}/>
}

export function toPath(points: [x: number, y: number][]): string {
    const { gridSize } = StateMgr.get();
    const segments: string[] = [];

    for (const i of points)
        segments.push(`${i[0] * gridSize + Math.floor(gridSize / 2)},${i[1] * gridSize + Math.floor(gridSize / 2)}`);

    return segments.join(' ');
}