import React from 'react';

import type { Colour } from '../../../../app/ext/ThemeManager';
import { StateMgr } from '../ext';

export interface ComponentProps {
    inputs: [active: boolean, label?: string][],
    outputs: [active: boolean, label?: string][],
    pos: [number, number],
    direction?: [dir: 0 | 90 | 180 | 270, flip?: boolean],
    label?: string,
    debugTarget?: boolean
}

export default class Component extends React.Component<ComponentProps> {
    render() {
        const { getValue, gridSize } = StateMgr.get();

        const pos = {
            x: this.props.pos[0] * gridSize + 1.5,
            y: this.props.pos[1] * gridSize + 1.5,
            width: gridSize,
            height: Math.max(this.props.inputs.length, this.props.outputs.length) * gridSize
        };

        return <g stroke={getValue<Colour>('colours.foreground')?.stringify()} strokeWidth='1' fill={getValue<Colour>('colours.background')?.stringify()}>
            <rect x={pos.x} y={pos.y} width={pos.width} height={pos.height}>

                {this.props.label && <text x={pos.x + pos.width / 2} y={pos.y + pos.height / 2} textAnchor='middle' dominantBaseline='middle'>
                    {this.props.label}
                </text>}

            </rect>
        </g>;
    }
}