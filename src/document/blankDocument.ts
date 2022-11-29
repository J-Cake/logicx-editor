import type ChainComponent from "../circuit/chaincomponent";
import type {TruthTable} from "../circuit/stateless";
import type Stateless from "../circuit/stateless";
import type Dynamic from "../circuit/dynamic";

import Document from "./document";
import {extension} from "./ext";

export default class BlankDocument extends Document {
    constructor() {
        super('', {
            circuitName: `Untitled Document`,
            content: {},
            components: [], // List of component tokens
            ownerEmail: '',
        });

        const [a, b, and, out] = BlankDocument.mkTmp();

        this.components.push(a, b, and, out);
        this.apiComponent.push({
            direction: 0,
            flip: false,
            label: 'A',
            position: [0, 0],
            token: 'a',
            wires: {
                2: [{
                    coords: [],
                    inputIndex: 0,
                    outputIndex: 0
                }]
            },
            outputs: {}
        }, {
            direction: 0,
            flip: false,
            label: 'B',
            position: [0, 1],
            token: 'b',
            wires: {
                2: [{
                    coords: [],
                    inputIndex: 1,
                    outputIndex: 0
                }]
            },
            outputs: {}
        }, {
            direction: 0,
            flip: false,
            label: 'and',
            position: [2, 0],
            token: 'and',
            wires: {
                3: [{
                    coords: [],
                    inputIndex: 0,
                    outputIndex: 0
                }]
            },
            outputs: {}
        }, {
            direction: 0,
            flip: false,
            label: 'out',
            position: [4, 0],
            token: 'out',
            wires: {},
            outputs: {}
        });

        // and.addInput(a, 'input', 'a');
        // and.addInput(b, 'input', 'b');
        //
        // out.addInput(and, 'and', 'output');
    }

    private static mkTmp(): ChainComponent<any, any>[] {
        const StatelessComponent: typeof Stateless = extension.api().getNamespace('circuit').getSymbol('Stateless')!;
        const DynamicComponent: typeof Dynamic = extension.api().getNamespace('circuit').getSymbol('Dynamic')!;

        const Input = class Input extends DynamicComponent<[], ['input']> {
            private value: boolean = false;

            constructor() {
                super([], ['input']);
            }

            onActivate() {
                this.value = !this.value;
                for (const _ of this.update()) ;
            }

            protected propagate(input: {}): { input: boolean; } {
                return {
                    input: this.value
                }
            }
        }
        const And = class And extends StatelessComponent<['a', 'b'], ['and']> {
            public readonly truthTable: TruthTable<['a', 'b'], ['and']> = [
                [{a: false, b: false}, {and: false}],
                [{a: true, b: false}, {and: false}],
                [{a: false, b: true}, {and: false}],
                [{a: true, b: true}, {and: true}],
            ];

            constructor() {
                super(['a', 'b'], ['and']);
            }
        }
        const Output = class Output extends DynamicComponent<['output'], []> {
            constructor() {
                super(['output'], []);
            }

            protected propagate(input: { output: boolean; }): {} {
                return {};
            }
        }

        const inputs = [new Input(), new Input()];
        const and = new And();
        const output = new Output();

        and.addInput(inputs[0], 'input', 'a');
        and.addInput(inputs[1], 'input', 'b');
        output.addInput(and, 'and', 'output');

        return [...inputs, and, output];
    }
}