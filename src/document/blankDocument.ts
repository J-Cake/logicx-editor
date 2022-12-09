import type ChainComponent from "../circuit/chaincomponent";
import type Stateless from "../circuit/stateless";
import type Dynamic from "../circuit/dynamic";

import Document, {ComponentBuilder} from "./document";
import {extension} from "./ext";

export default class BlankDocument extends Document {
    constructor() {
        super('', {
            circuitName: `Untitled Document`,
            content: [],
            components: {}, // List of component tokens
            ownerEmail: '', // TODO: Get this from the API
        });

        Object.assign(this, {loaded: BlankDocument.generateComponents()});

        this.circuit.push(...BlankDocument.mkTmp(this.loaded));
        this.renderMap.push({
            direction: 0,
            flip: false,
            label: 'A',
            position: [0, 0],
            token: '$input',
            wires: {
                2: [{
                    coords: [],
                    inputIndex: 0,
                    outputIndex: 0
                }]
            },
        }, {
            direction: 0,
            flip: false,
            label: 'B',
            position: [0, 1],
            token: '$input',
            wires: {
                2: [{
                    coords: [],
                    inputIndex: 1,
                    outputIndex: 0
                }]
            },
        }, {
            direction: 0,
            flip: false,
            label: 'and',
            position: [2, 0],
            token: '$and',
            wires: {
                3: [{
                    coords: [],
                    inputIndex: 0,
                    outputIndex: 0
                }]
            },
        }, {
            direction: 0,
            flip: false,
            label: 'not',
            position: [4, 0],
            token: '$not',
            wires: {
                4: [{
                    coords: [],
                    inputIndex: 0,
                    outputIndex: 0
                }]
            },
        }, {
            direction: 0,
            flip: false,
            label: 'out',
            position: [6, 0],
            token: '$output',
            wires: {},
        });

        this.circuit.map(i => [...(i as any).update()]);
    }

    private static generateComponents(): Record<string, ComponentBuilder<any, any>> {
        const stateless: typeof Stateless = extension.api().getNamespace('circuit').getSymbol('Stateless')!;
        const dynamic: typeof Dynamic = extension.api().getNamespace('circuit').getSymbol('Dynamic')!;

        return {
            '$input': dynamic.fromFunction('$input', 'Input', [], ['input'], {
                origin: `js:return { propagate() { return { input: this.value } }, onActivate() { this.value = !this.value } }`,
                propagate(this: { value: boolean } & Dynamic<[], ['input']>) {
                    return {input: this.value};
                },
                onActivate(this: { value: boolean } & Dynamic<[], ['input']>) {
                    this.value = !this.value;
                },
            }),
            '$and': stateless.fromTruthTable('$and', 'And', ['a', 'b'], ['and'], [
                [{a: false, b: false}, {and: false}],
                [{a: true, b: false}, {and: false}],
                [{a: false, b: true}, {and: false}],
                [{a: true, b: true}, {and: true}],
            ]),
            '$not': stateless.fromTruthTable('$not', 'Not', ['q'], ['q\''], [
                [{q: false}, {'q\'': true}],
                [{q: true}, {'q\'': false}],
            ]),
            '$output': dynamic.fromFunction('$output', 'Output', ['output'], [], {})
        } as const;
    }

    private static mkTmp(loaded: Record<string, ComponentBuilder<any, any>>): ChainComponent<any, any>[] {
        const inputs = [loaded['$input'].new(), loaded['$input'].new()];
        const and = loaded['$and'].new();
        const not = loaded['$not'].new();
        const output = loaded['$output'].new();

        and.addInput(inputs[0], 'input', 'a');
        and.addInput(inputs[1], 'input', 'b');
        not.addInput(and, 'and', 'q');
        output.addInput(not, 'q\'', 'output');

        return [...inputs, and, not, output];
    }
}
