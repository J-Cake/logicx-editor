import React from 'react';

import type { Extension } from '../../app/ext/Extension';
import StateManager from '../../app/stateManager';

import Component from './render/component';

// @ts-ignore
import glob from './glob.css';
import ChainComponent from './chaincomponent';

export const name = 'chain';

// export let getValue: <T>(path: string) => T = () => null;

export const StateMgr = new StateManager<{
    zoom: number,
    pan: [number, number],
    grid: boolean,

    gridSize: number,
    snap: boolean,

    components: { [componentId in string]: ChainComponent<any> }

    getValue: <T>(path: string) => T,
}>({ zoom: 1, pan: [0, 0], gridSize: 35, grid: false, getValue: () => null });

export default function Ext(extension: Extension) {
    StateMgr.setState({ getValue: extension.currentTheme });

    const inputs = new Array(2).fill(class extends ChainComponent<{ inputs: [], outputs: ['input'] }> {
        constructor() { super([] as never[], ['input']); }

        propagate(input: boolean[]): boolean[] {
            return [true];
        }
    }).map(i => new i()) as ChainComponent<{ inputs: [], outputs: ['input'] }>[];

    const and = new class extends ChainComponent<{ inputs: ['a', 'b'], outputs: ['and'] }> {
        constructor() { super(['a', 'b'], ['and']); }

        propagate(input: boolean[]): boolean[] {
            return [input[0] && input[1]];
        }
    }

    and.addInput(inputs[0], 'input', 'a');
    and.addInput(inputs[1], 'input', 'b');

    for (const i of inputs)
        i.update();

    console.log(and.outbound);

    extension.ui.viewport(function (parent) {
        return <svg width='100%' height='100%'>
            <style>{glob}</style>
            <Component outputs={[[true, 'subtract'], [false, '1']]} inputs={[[false, 'output']]} pos={[0, 0]} label='test' />
        </svg>;
    });
}