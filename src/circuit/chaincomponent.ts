import _ from 'lodash';
import {ApiComponentDefinition} from "../../core/api/resources";
import {ComponentBuilder} from "../document/document";

export default abstract class ChainComponent<Inputs extends string[], Outputs extends string[]> {
    public static get component(): ApiComponentDefinition<any, any> {
        throw `Not Implemented`;
    }

    public static onUpdate?: () => void;
    public readonly inputMap: { [id in Inputs[number]]: [ChainComponent<any[], any[]>, string] };
    public readonly outputMap: { [id in Outputs[number]]: [ChainComponent<any[], any[]>, string][] };
    public readonly inbound: { [id in Inputs[number]]: boolean };
    public readonly outbound: { [id in Outputs[number]]: boolean };
    public shouldBreak?: (component: ChainComponent<any[], any[]>) => boolean;

    protected constructor(public inputLabels: Inputs, public outputLabels: Outputs) {
        this.inputMap = _.fromPairs(_.map(inputLabels, i => [i, null])) as any;
        this.outputMap = _.fromPairs(_.map(outputLabels, i => [i, []])) as any;
        this.inbound = _.fromPairs(_.map(inputLabels, i => [i, false])) as any;
        this.outbound = _.fromPairs(_.map(outputLabels, i => [i, false])) as any;
    }

    public static update(component: ChainComponent<any[], any[]>) {
        void [...component.update()];
    }

    static async load<Inputs extends string[], Outputs extends string[]>(data: ApiComponentDefinition<Inputs, Outputs>): Promise<ComponentBuilder<Inputs, Outputs>> {
        throw `Not Implemented`
    }

    static new<Inputs extends string[], Outputs extends string[]>(): ChainComponent<Inputs, Outputs> {
        throw `Not Implemented`;
    }

    addInput<_Inputs extends string[], Outputs extends string[]>(component: ChainComponent<_Inputs, Outputs>, from: Outputs[number], to: Inputs[number]): this {
        if (component && to && to in this.inputMap && from in component.outputMap) {

            this.inputMap[to] = [component, from];
            component.outputMap[from].push([this, to]);

        } else throw `Invalid terminal`;

        return this;
    }

    * update(): Generator<ChainComponent<any[], any[]>> {
        if (ChainComponent.onUpdate)
            ChainComponent.onUpdate();

        for (const i in this.inputMap)
            this.inbound[i as Inputs[number]] = this.inputMap[i as Inputs[number]]?.[0].outbound[this.inputMap[i as Inputs[number]][1]] ?? false;

        Object.assign(this.outbound, this.propagate(this.inbound));

        if (this.shouldBreak?.(this))
            yield this; // for use in debugging

        for (const i in this.outputMap)
            for (const [comp] of this.outputMap[i as Inputs[number]])
                for (const val of comp.update())
                    yield val;
    }

    protected abstract propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'];

    protected onActivate(): void {
    };
    //
    // static from<Inputs extends string[], Outputs extends string[]>(token: string, name: string, inputs: Inputs, outputs: Outputs): ComponentBuilder<Inputs, Outputs> {
    //     throw `Not Implemented`;
    // }
}
