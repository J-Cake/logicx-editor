import React from 'react';
import {chain as _} from 'lodash';

import type {Colour} from '../../../core/ext/ThemeManager';
import {StateMgr} from '../ext';

export interface ComponentProps {
    inputs: { [key in string]: boolean },
    outputs: { [key in string]: boolean },
    pos: [number, number],
    direction?: [dir: 0 | 90 | 180 | 270, flip?: boolean],
    label?: string,
    debugTarget?: boolean,

    onActivate?: () => void,
    selected?: boolean,
}

export default class RenderComponent extends React.Component<ComponentProps, ComponentProps> {
    constructor(props: ComponentProps) {
        super(props);

        this.state = {...props};
    }

    public static readonly terminalLength: number = 7;

    get pos(): [x: number, y: number] {
        const state = StateMgr.get();

        if (state.snap)
            return [Math.floor(this.state.pos[0] / state.gridSize) * state.gridSize, Math.floor(this.state.pos[1] / state.gridSize) * state.gridSize];
        else return this.state.pos;
    }

    render() {
        const {getValue, gridSize} = StateMgr.get();

        const active = getValue<Colour>('colours.primary');
        const base = this.state.selected ?
            getValue<Colour>('colours.secondary') :
            getValue<Colour>('colours.foreground');
        const background = getValue<Colour>('colours.background');

        const inputNum = Object.keys(this.state.inputs).length, outputNum = Object.keys(this.state.outputs).length;

        const grid = {
            x: this.pos[0] * gridSize,
            y: this.pos[1] * gridSize,
            width: gridSize,
            height: Math.max(inputNum, outputNum) * gridSize,
        };
        const pos = {
            x: grid.x + RenderComponent.terminalLength,
            y: grid.y + RenderComponent.terminalLength,
            width: gridSize - 2 * RenderComponent.terminalLength,
            height: Math.max(inputNum, outputNum) * gridSize - 2 * RenderComponent.terminalLength,
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
                  onClick={() => StateMgr.get().extStorage.get().actions['click']?.forEach(i => i(this))}
                  onDoubleClick={() => StateMgr.get().extStorage.get().actions['dblclick']?.forEach(i => i(this))}>

            <rect x={pos.x} y={pos.y} width={pos.width} height={pos.height}>e

                {this.state.label && <text x={pos.x + pos.width / 2} y={pos.y + pos.height / 2} textAnchor='middle'
                                           dominantBaseline='middle'>
                    {this.state.label}
                </text>}

            </rect>

            {_(this.state.inputs).entries().map(([, isActive], a) => <polyline key={`input-term-${a}`}
                                                                               stroke={isActive ? active!.stringify() : base!.stringify()}
                                                                               points={input(a)}/>).value()}
            {_(this.state.outputs).entries().map(([, isActive], a) => <polyline key={`output-term-${a}`}
                                                                                stroke={isActive ? active!.stringify() : base!.stringify()}
                                                                                points={output(a)}/>).value()}

            {/* { this.state.inputs.map((i, a) => <polyline key={`input-term-${a}`} str5oke={i[0] ? active!.stringify() : base!.stringify()} points={ input(a) }/>) }
            { this.state.outputs.map((i, a) => <polyline key={`output-term-${a}`} stroke={i[0] ? active!.stringify() : base!.stringify()} points={ output(a) }/>) } */}
        </g>;
    }
}