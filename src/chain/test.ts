import ChainComponent from "./chaincomponent";

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

and.shouldBreak = () => true;

and.addInput(inputs[0], 'input', 'a');
and.addInput(inputs[1], 'input', 'b');

for (const i of inputs)
    for (const _ of i.update()) 
        await new Promise(next => setTimeout(next, 2000)); // breaking for 2s. Seems to be working \_o_/

console.log(and.outbound);