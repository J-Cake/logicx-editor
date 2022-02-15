import React from 'react';
import { getValue } from '../ext';

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

        console.log(getValue('borders.colour'));

        return <g stroke={getValue('borders.colour').toString()} strokeWidth='5' fill={getValue('colours.background').toString()}>
            <circle cx='40' cy='40' r='25' />
            <circle cx='60' cy='60' r='25' />
        </g>;
    }
}