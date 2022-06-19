import React from 'react';
import { chain as _ } from 'lodash';

import type { Colour } from '../../../core/ext/ThemeManager';
import { StateMgr } from '../ext';
import ChainComponent from '../chaincomponent';

export interface ComponentProps {
    inputs: { [key in string]: boolean },
    outputs: { [key in string]: boolean },
    pos: [number, number],
    direction?: [dir: 0 | 90 | 180 | 270, flip?: boolean],
    label?: string,
    debugTarget?: boolean,

    chain: ChainComponent<any, any>,

    selected?: boolean,
}

export const terminalLength = 7;

export function getPos(pos: [x: number, y: number]): [x: number, y: number] {
    const state = StateMgr.get();

    if (state.snap)
        return [Math.floor(pos[0] / state.gridSize) * state.gridSize, Math.floor(pos[1] / state.gridSize) * state.gridSize];
    else return pos;
}

export default function RenderComponent(props: ComponentProps): JSX.Element {
    const { getValue, gridSize, extStorage } = StateMgr.get();

    const active = getValue<Colour>('colours.primary');
    const base = props.selected ?
        getValue<Colour>('colours.secondary') :
        getValue<Colour>('colours.foreground');
    const background = getValue<Colour>('colours.background');

    const inputNum = Object.keys(props.inputs).length, outputNum = Object.keys(props.outputs).length;

    const _pos = getPos(props.pos);
    const grid = {
        x: _pos[0] * gridSize,
        y: _pos[1] * gridSize,
        width: gridSize,
        height: Math.max(inputNum, outputNum) * gridSize,
    };
    const pos = {
        x: grid.x + terminalLength,
        y: grid.y + terminalLength,
        width: gridSize - 2 * terminalLength,
        height: Math.max(inputNum, outputNum) * gridSize - 2 * terminalLength,
    };

    const input = (a: number): string => [
        [grid.x, grid.y + gridSize * a + Math.floor(gridSize / 2)],
        [pos.x, grid.y + gridSize * a + Math.floor(gridSize / 2)],
        [pos.x, Math.max(pos.y, grid.y + gridSize * a)],
        [pos.x, Math.min(pos.y + pos.height, grid.y + gridSize * a + gridSize)],
    ].map(i => i.join(' ')).join(',');
    const output = (a: number): string => [
        [grid.x + grid.width, grid.y + gridSize * a + Math.floor(gridSize / 2)],
        [pos.x + pos.width, grid.y + gridSize * a + Math.floor(gridSize / 2)],
        [pos.x + pos.width, Math.max(pos.y, grid.y + gridSize * a)],
        [pos.x + pos.width, Math.min(pos.y + pos.height, grid.y + gridSize * a + gridSize)],
    ].map(i => i.join(' ')).join(',');

    return <g stroke={base?.stringify()} strokeWidth='1' fill={background?.stringify()}
        onClick={() => extStorage.get().emitEvent('click', props.chain)}>
        <rect x={pos.x} y={pos.y} width={pos.width} height={pos.height}>

            {props.label && <text x={pos.x + pos.width / 2} y={pos.y + pos.height / 2} textAnchor='middle'
                dominantBaseline='middle'>
                {props.label}
            </text>}

        </rect>

        {_(props.inputs).entries().map(([, isActive], a) => <polyline key={`input-term-${a}`}
            stroke={isActive ? active!.stringify() : base!.stringify()}
            points={input(a)} />).value()}
        {_(props.outputs).entries().map(([, isActive], a) => <polyline key={`output-term-${a}`}
            stroke={isActive ? active!.stringify() : base!.stringify()}
            points={output(a)} />).value()}

        {/* { props.inputs.map((i, a) => <polyline key={`input-term-${a}`} str5oke={i[0] ? active!.stringify() : base!.stringify()} points={ input(a) }/>) }
            { props.outputs.map((i, a) => <polyline key={`output-term-${a}`} stroke={i[0] ? active!.stringify() : base!.stringify()} points={ output(a) }/>) } */}
    </g>;
}