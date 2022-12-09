import _ from 'lodash';

import ChainComponent from "./chaincomponent";
import {ApiStatefulComponentDefinition} from "#core/api/resources";
import Dynamic from "./dynamic";
import {ComponentBuilder} from "../document/document";

export default abstract class Stateful<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    protected readonly worker: Worker;
    protected prevOutput: ChainComponent<Inputs, Outputs>['outbound'];

    // TODO: Internal Representation

    protected constructor(inputs: Inputs, outputs: Outputs) {
        super(inputs, outputs);

        this.prevOutput = _.chain(outputs)
            .map(i => [i, false] as [keyof typeof this.prevOutput, boolean])
            .fromPairs()
            .value() as any;

        this.worker = new Worker("stateful-worker.js", {
            type: "module"
        })
    }

    static async load<Inputs extends string[], Outputs extends string[]>(data: ApiStatefulComponentDefinition<Inputs, Outputs>): Promise<ComponentBuilder<Inputs, Outputs>> {
        // @ts-expect-error ???
        return class extends Stateful<any, any> {
            public static readonly component = data;
            static new(): Stateful<Inputs, Outputs> {
                return new this(data.inputs, data.outputs);
            }
        };
    }

    protected propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'] {
        return this.prevOutput;
    }
}
