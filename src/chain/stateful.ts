import _ from 'lodash';

import ChainComponent from "./chaincomponent";

export default abstract class Stateful<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    protected readonly worker: Worker;
    protected prevOutput: ChainComponent<Inputs, Outputs>['outbound'];
    
    protected constructor(inputs: Inputs[number][], outputs: Outputs[number][]) {
        super(inputs, outputs);

        this.prevOutput = _.chain(outputs)
            .map(i => [i, false] as [keyof typeof this.prevOutput, boolean])
            .fromPairs()
            .value() as any;
        this.worker = new Worker("stateful-worker.js", {
            type: "module"
        })
    }

    protected propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'] {
        return this.prevOutput;
    }
}