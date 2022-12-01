import Lodash from 'lodash';

import ChainComponent from "./chaincomponent";
import {ApiStatelessComponentDefinition} from "../../core/api/resources";

export type TruthTable<Inputs extends string[], Outputs extends string[]> = [input: { [input in Inputs[number]]: boolean }, output: { [output in Outputs[number]]: boolean }][];

export default abstract class Stateless<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    public readonly abstract truthTable: TruthTable<Inputs, Outputs>;

    protected constructor(token: string, name: string, inputs: Inputs[number][], outputs: Outputs[number][]) {
        super(token, name, inputs, outputs);
    }

    static async load(data: ApiStatelessComponentDefinition): Promise<Stateless<any, any>> {
        return new class extends Stateless<any, any> {
            public readonly truthTable: TruthTable<any, any> = data.truthTable;
        }(data.name, data.token, data.inputs, data.outputs);
    }

    export(): ApiStatelessComponentDefinition {
        return {
            type: 'Stateless',

            token: this.token,
            name: this.name,

            inputs: this.inputLabels,
            outputs: this.outputLabels,

            truthTable: this.truthTable
        }
    }

    protected propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'] {
        for (const i of this.truthTable)
            if (Lodash.isEqual(i[0], input))
                return i[1];

        return Lodash.mapValues(this.outbound, i => false);
    }
}