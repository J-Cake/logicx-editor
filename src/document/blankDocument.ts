import type ChainComponent from "../circuit/chaincomponent";
import type Stateless from "../circuit/stateless";
import type { TruthTable } from "../circuit/stateless";
import type Dynamic from "../circuit/dynamic";

import Document from "./document";
import {extension} from "./ext";

export default class BlankDocument extends Document {
    constructor() {
        super('', {
            circuitName: `Untitled Document`,
            content: [],
            components: {}, // List of component tokens
            ownerEmail: '', // TODO: Get this from the API
        });

        this.components.push(...BlankDocument.mkTmp());
        this.apiComponent.push({
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
            outputs: {}
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
            outputs: {}
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
            outputs: {}
        }, {
            direction: 0,
            flip: false,
            label: 'not',
            position: [4, 0],
            token: '$not',
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
            position: [6, 0],
            token: '$output',
            wires: {},
            outputs: {}
        });

        this.components.map(i => [...(i as any).update()]);
    }


    private static mkTmp(): ChainComponent<any, any>[] {
        const StatelessComponent: typeof Stateless = extension.api().getNamespace('circuit').getSymbol('Stateless')!;
        const DynamicComponent: typeof Dynamic = extension.api().getNamespace('circuit').getSymbol('Dynamic')!;

        const Input = class Input extends DynamicComponent<[], ['input']> {
            private value: boolean = false;

            constructor() {
                super('$input', 'Input', [], ['input']);

                this.propagate = _ => ({input: this.value});
                this.origin = `js:return Object.assign(function(){return{input:ctx.value}},{onActivate:function(){ctx.value=!ctx.value;[...ctx.update()]}.bind(ctx)})`
            }

            onActivate() {
                this.value = !this.value;
                for (const _ of this.update()) ;
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
                super('$and', 'And', ['a', 'b'], ['and']);
            }
        }
        const Not = class Not extends StatelessComponent<['q'], ['q\'']> {
            public readonly truthTable: TruthTable<['q'], ['q\'']> = [
                [{q: false}, {'q\'': true}],
                [{q: true}, {'q\'': false}],
            ];

            constructor() {
                super('$not', 'Not', ['q'], ['q\'']);
            }
        }
        const Output = class Output extends DynamicComponent<['output'], []> {
            constructor() {
                super('$output', 'Output', ['output'], []);

                this.propagate = _ => ({});
            }
        }

        const inputs = [new Input(), new Input()];
        const and = new And();
        const not = new Not();
        const output = new Output();

        and.addInput(inputs[0], 'input', 'a');
        and.addInput(inputs[1], 'input', 'b');
        not.addInput(and, 'and', 'q');
        output.addInput(not, 'q\'', 'output');

        return [...inputs, and, not, output];
    }
}