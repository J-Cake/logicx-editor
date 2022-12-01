import _ from 'lodash';

import ChainComponent from "./chaincomponent";
import {ApiDynamicComponentDefinition} from "../../core/api/resources";

type PropagateFn<Inputs extends string[], Outputs extends string[]> = (input: ChainComponent<Inputs, Outputs>["inbound"]) => ChainComponent<Inputs, Outputs>["outbound"];

export default abstract class Dynamic<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    protected origin: string;
    protected propagate: PropagateFn<Inputs, Outputs>;

    protected constructor(token: string, name: string, inputs: Inputs[number][], outputs: Outputs[number][]) {
        super(token, name, inputs, outputs);

        this.origin = '';
        this.propagate = (input: ChainComponent<Inputs, Outputs>["inbound"]) => _.chain(outputs)
            .map(i => [i, false])
            .fromPairs()
            .value() as any;
    }

    static async fetch<Input extends string[], Output extends string[]>(origin: string): Promise<(_this: Dynamic<Input, Output>) => PropagateFn<Input, Output>> {
        const url = new URL(origin);

        const body = url.protocol.startsWith('http') ? await fetch(url).then(res => res.text()) : ['javascript:', 'js:'].includes(url.protocol) ? url.pathname : '';
        return new Function('ctx', body) as any;
    }

    static async load<Inputs extends string[], Outputs extends string[]>(data: ApiDynamicComponentDefinition): Promise<Dynamic<Inputs, Outputs>> {
        const parsed = await Dynamic.fetch<Inputs, Outputs>(data.origin);

        return new class extends Dynamic<Inputs, Outputs> {
            constructor(token: string, name: string, inputs: Inputs, outputs: Outputs) {
                super(token, name, inputs, outputs);
                this.propagate = parsed(this);
                this.origin = data.origin;
            }
        }(data.token, data.name, data.inputs as Inputs, data.outputs as Outputs);
    }

    export(): ApiDynamicComponentDefinition {
        return {
            type: 'Dynamic',

            token: this.token,
            name: this.name,

            origin: this.origin,

            inputs: this.inputLabels,
            outputs: this.outputLabels,
        }
    }
}