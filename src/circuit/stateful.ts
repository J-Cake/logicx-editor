import _ from 'lodash';

import ChainComponent from "./chaincomponent";
import {ApiStatefulComponentDefinition} from "../../core/api/resources";

export default abstract class Stateful<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    protected readonly worker: Worker;
    protected prevOutput: ChainComponent<Inputs, Outputs>['outbound'];

    // TODO: Internal Representation
    
    protected constructor(token: string, name: string, inputs: Inputs[number][], outputs: Outputs[number][]) {
        super(token, name, inputs, outputs);

        this.prevOutput = _.chain(outputs)
            .map(i => [i, false] as [keyof typeof this.prevOutput, boolean])
            .fromPairs()
            .value() as any;

        this.worker = new Worker("stateful-worker.js", {
            type: "module"
        })
    }

    static async load(data: ApiStatefulComponentDefinition): Promise<Stateful<any, any>> {
        return new class extends Stateful<any, any> {
            constructor(token: string, name: string, inputs: string[], outputs: string[]) {
                super(token, name, inputs, outputs);
            }
        }(data.token, data.name, data.inputs, data.outputs)
    }

    protected propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'] {
        return this.prevOutput;
    }

    export(): ApiStatefulComponentDefinition {
        return {
            type: "Stateful",

            token: this.token,
            name: this.name,

            inputs: this.inputLabels,
            outputs: this.outputLabels,

            children: {} // TODO: Internal Representation
        }
    }
}