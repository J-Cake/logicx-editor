import _ from 'lodash';

import ChainComponent from "./chaincomponent";

export interface Script<Inputs extends string[], Outputs extends string[]> {
    origin: string;
    source: string;
    propagate(input: boolean[]): boolean[]
}

export default abstract class Dynamic<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    protected script: Script<Inputs, Outputs>;

    protected constructor(inputs: Inputs[number][], outputs: Outputs[number][]) {
        super(inputs, outputs);

        this.script = {} as any;
    }

    protected propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'] {
        return _.chain(this.outputLabels)
            .map(i => [i, false] as [string, boolean])
            .fromPairs()
            .value() as any;
    }
}