import Lodash from 'lodash';

import ChainComponent from "./chaincomponent";

export type TruthTable<Inputs extends string[], Outputs extends string[]> = [input: { [input in Inputs[number]]: boolean }, output: { [output in Outputs[number]]: boolean }][];

export default abstract class Stateless<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    public readonly abstract truthTable: TruthTable<Inputs, Outputs>;

    protected constructor(inputs: Inputs[number][], outputs: Outputs[number][]) {
        super(inputs, outputs);
    }

    protected propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'] {
        for (const i of this.truthTable)
            if (Lodash.isEqual(i[0], input))
                return i[1];

        return Lodash.mapValues(this.outbound, i => false);
    }
}