import ChainComponent from "../chain/chaincomponent";
import Stateless, { TruthTable } from "../chain/stateless";
import Document from "./document";

export default class BlankDocument extends Document {
    constructor() {
        super('', {
            circuitName: `Untitled Document`,
            content: {},
            components: [], // List of component tokens
            ownerEmail: '',
        });

        const [a, b, and] = BlankDocument.mkTmp();

        this.components.push(a, b, and);
        this.apiComponent.push({
            direction: 0,
            flip: false,
            label: 'A',
            position: [0, 0],
            token: 'a',
            wires: {},
            outputs: {}
        }, {
            direction: 0,
            flip: false,
            label: 'B',
            position: [0, 1],
            token: 'b',
            wires: {},
            outputs: {}
        }, {
            direction: 0,
            flip: false,
            label: 'and',
            position: [2, 0],
            token: 'and',
            wires: {},
            outputs: {}
        });

        and.addInput(a, 'input', 'a');
        and.addInput(b, 'input', 'b');
    }

    private static mkTmp(): ChainComponent<any, any>[] {
        const Input = class extends ChainComponent<[], ['input']> {
            private value: boolean = false;
        
            constructor() {
                super([], ['input']);
            }
        
            protected propagate(input: {}): { input: boolean; } {
                return {
                    input: this.value
                }
            }

            onActivate() {
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

            onActivate = void 0;
        }
        const inputs = [new Input(), new Input()];
        and.addInput(inputs[0], 'input', 'a');
        and.addInput(inputs[1], 'input', 'b');

        return [...inputs, and];
    }
}