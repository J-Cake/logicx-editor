import React from 'react';

import type { Colour } from '../../../app/ext/ThemeManager';
import { StateMgr } from '../ext';

export interface ComponentProps {
    inputs: [active: boolean, label?: string][],
    outputs: [active: boolean, label?: string][],
    pos: [number, number],
    direction?: [dir: 0 | 90 | 180 | 270, flip?: boolean],
    label?: string,
    debugTarget?: boolean
}

export default class Component extends React.Component<ComponentProps, ComponentProps> {

    constructor(props) {
        super(props);

        this.state = props
    }

    public static readonly terminalLength: number = 7;

    get pos(): [x: number, y: number] {
        const state = StateMgr.get();

        if (state.snap)
            return [Math.floor(this.state.pos[0] / state.gridSize) * state.gridSize, Math.floor(this.state.pos[1] / state.gridSize) * state.gridSize];
        else return this.state.pos;
    }
    
    render() {
        const { getValue, gridSize } = StateMgr.get();

        const active = getValue<Colour>('colours.primary');
        const base = getValue<Colour>('colours.foreground');
        const background = getValue<Colour>('colours.background');

        const grid = {
            x: this.pos[0] * gridSize + 1.5,
            y: this.pos[1] * gridSize + 1.5,
            width: gridSize,
            height: Math.max(this.state.inputs.length, this.state.outputs.length) * gridSize,
        };
        const pos = {
            x: grid.x + Component.terminalLength,
            y: grid.y + Component.terminalLength,
            width: gridSize - 2 * Component.terminalLength,
            height: Math.max(this.state.inputs.length, this.state.outputs.length) * gridSize - 2 * Component.terminalLength,
        };

        const input = (a: number): string => [
            [grid.x, grid.y + gridSize * a + gridSize / 2],
            [pos.x, grid.y + gridSize * a + gridSize / 2],
            [pos.x, Math.max(pos.y, grid.y + gridSize * a)],
            [pos.x, Math.min(pos.y + pos.height, grid.y + gridSize * a + gridSize)],
        ].map(i => i.join(' ')).join(',');
        const output = (a: number): string => [
            [grid.x + grid.width, grid.y + gridSize * a + gridSize / 2],
            [pos.x + pos.width, grid.y + gridSize * a + gridSize / 2],
            [pos.x + pos.width, Math.max(pos.y, grid.y + gridSize * a)],
            [pos.x + pos.width, Math.min(pos.y + pos.height, grid.y + gridSize * a + gridSize)],
        ].map(i => i.join(' ')).join(',');

        return <g stroke={base?.stringify()} strokeWidth='1' fill={background?.stringify()}>

            <rect x={pos.x} y={pos.y} width={pos.width} height={pos.height}>e

                {this.state.label && <text x={pos.x + pos.width / 2} y={pos.y + pos.height / 2} textAnchor='middle' dominantBaseline='middle'>
                    {this.state.label}
                </text>}

            </rect>

            { this.state.inputs.map((i, a) => <polyline stroke={i[0] ? active.stringify() : base.stringify()} points={ input(a) }/>) }
            { this.state.outputs.map((i, a) => <polyline stroke={i[0] ? active.stringify() : base.stringify()} points={ output(a) }/>) }
        </g>;
    }
}