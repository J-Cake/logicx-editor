import React from 'react';

import type { Extension } from '../../app/ext/Extension';
import StateManager from '../../app/stateManager';

import RenderComponent from './render/component';

// @ts-ignore
import glob from './glob.css';
import ChainComponent from './chaincomponent';
import Wire from './render/wire';
import Stateless, { TruthTable } from './stateless';

export const name = 'chain';

export const StateMgr = new StateManager<{
    zoom: number,
    pan: [number, number],
    grid: boolean,

    gridSize: number,
    snap: boolean,

    components: { [componentId in string]: ChainComponent<any[], any[]> }

    getValue: <T>(path: string) => T | null,
}>({ zoom: 1, pan: [0, 0], gridSize: 35, grid: false, getValue: () => null });



const Input = class extends ChainComponent<[], ['input']> {
    private value: boolean = false;

    constructor() {
        super([], ['input'])
    }

    protected propagate(input: {}): { input: boolean; } {
        return {
            input: this.value
        }
    }

    toggle() {
        console.log('toggling');
        this.value = !this.value;
        for (const _ of this.update());
    }
}
const and = new class extends Stateless<['a', 'b'], ['and']> {
    public readonly truthTable: TruthTable<['a', 'b'], ['and']> = [
        [{ a: false, b: false }, { and: false }],
        [{ a: true, b: false }, { and: false }],
        [{ a: false, b: true }, { and: false }],
        [{ a: true, b: true }, { and: true }],
    ];

    constructor() {
        super(['a', 'b'], ['and']);
    }
}
const inputs = [new Input(), new Input()];
and.addInput(inputs[0], 'input', 'a');
and.addInput(inputs[1], 'input', 'b');

export default function Ext(extension: Extension) {
    const { pan, zoom } = StateMgr.setState({ getValue: extension.currentTheme });

    // TODO: Figure out how to migrate to function component
    class Viewport extends React.Component<{ pan: [number, number], zoom: number }, { pan: [number, number], zoom: number }> {

        private updateTimeout?: number;
        private readonly ref = React.createRef<SVGSVGElement>();

        state = { pan: [0, 0] as [number, number], zoom: 1 };

        componentDidMount() {
            ChainComponent.onUpdate = () => this.updateTimeout ?? (this.updateTimeout = window.setTimeout(() => this.forceUpdate(), 1000 / 60));
            
            StateMgr.on('transform', state => this.setState({ pan: state.pan, zoom: state.zoom }));

            window.setTimeout(() => this.forceUpdate());
        }

        render() {
            const state = StateMgr.get();
            const [x, y] = [Math.floor(this.state.pan[0]) + 0.5, Math.floor(this.state.pan[1]) + 0.5];
            
            return <svg ref={this.ref} width='100%' height='100%' onWheel={e => StateMgr.dispatch('transform', prev => ({
                pan: [prev.pan[0] + e.deltaX, prev.pan[1] + e.deltaY]
            }))} viewBox={`${x} ${y} ${this.ref.current?.clientWidth ?? '0'} ${this.ref.current?.clientHeight ?? '0'}`}>
                <style>{glob}</style>
                
                <RenderComponent outputs={inputs[0].outbound} inputs={inputs[0].inbound} pos={[0, 0]} label='test' key={'input-1'} onActivate={() => inputs[0].toggle()} />
                <RenderComponent outputs={inputs[1].outbound} inputs={inputs[1].inbound} pos={[0, 1]} label='test' key={'input-2'} onActivate={() => inputs[1].toggle()} />
                <RenderComponent outputs={and.outbound} inputs={and.inbound} pos={[4, 0]} label='test' key={'and'} />
                <Wire points={[[0, 0], [4, 0]]} from={[inputs[0], 'input']} to={[and, 'a']} />
                <Wire points={[[0, 1], [4, 1]]} from={[inputs[1], 'input']} to={[and, 'b']} />
            </svg>;
        }
    }

    extension.ui.viewport(function (parent) {
        return <Viewport pan={pan} zoom={zoom} />;
    });
}