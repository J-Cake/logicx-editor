import Lodash from 'lodash';

import ChainComponent from "./chaincomponent";
import {ApiStatelessComponentDefinition} from "../../core/api/resources";
import {ComponentBuilder} from "../document/document";

export type TruthTable<Inputs extends string[], Outputs extends string[]> = [input: { [input in Inputs[number]]: boolean }, output: { [output in Outputs[number]]: boolean }][];

export default abstract class Stateless<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {
    public static readonly component: ApiStatelessComponentDefinition<any, any>;

    public readonly abstract truthTable: TruthTable<Inputs, Outputs>;

    protected constructor(inputs: Inputs, outputs: Outputs) {
        super(inputs, outputs);
    }

    static async load<Inputs extends string[], Outputs extends string[]>(data: ApiStatelessComponentDefinition<Inputs, Outputs>): Promise<ComponentBuilder<Inputs, Outputs>> {
        // @ts-expect-error ???
        return class extends Stateless<Inputs, Outputs> {
            public static readonly component = data;
            public readonly truthTable: TruthTable<Inputs, Outputs> = data.truthTable;

            static new(): Stateless<Inputs, Outputs> {
                return new this(data.inputs, data.outputs);
            }
        }
    }

    protected propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'] {
        for (const i of this.truthTable)
            if (Lodash.isEqual(i[0], input))
                return i[1];

        return Lodash.mapValues(this.outbound, i => false);
    }

    static fromTruthTable<Inputs extends string[], Outputs extends string[]>(token: string, name: string, inputs: Inputs, outputs: Outputs, truthTable: TruthTable<Inputs, Outputs>): ComponentBuilder<Inputs, Outputs> {
        // @ts-expect-error
        return class extends Stateless<Inputs, Outputs> {
            truthTable: TruthTable<Inputs, Outputs> = truthTable;
            static component: ApiStatelessComponentDefinition<Inputs, Outputs> = {
                type: "Stateless",
                name,
                token,
                truthTable,

                inputs,
                outputs,
            };

            static new(): Stateless<Inputs, Outputs> {
                return new this(inputs, outputs)
            }
        }
    }
}
