import _ from 'lodash';
import {ApiComponentDefinition} from "../../core/api/resources";

export default abstract class ChainComponent<Inputs extends string[], Outputs extends string[]> {

    public static onUpdate?: () => void;
    public readonly inputMap: { [id in Inputs[number]]: [ChainComponent<any[], any[]>, string] };
    public readonly outputMap: { [id in Outputs[number]]: [ChainComponent<any[], any[]>, string][] };
    public readonly inbound: { [id in Inputs[number]]: boolean };
    public readonly outbound: { [id in Outputs[number]]: boolean };
    public shouldBreak?: (component: ChainComponent<any[], any[]>) => boolean;

    protected constructor(protected token: string, protected name: string, protected inputLabels: Inputs[number][], protected outputLabels: Outputs[number][]) {
        this.inputMap = <any>_.fromPairs(_.map(inputLabels, i => [i, null]))// as ChainComponent<any[], any[]>['inputMap'];
        this.outputMap = <any>_.fromPairs(_.map(outputLabels, i => [i, []]))// as ChainComponent<any[], any[]>['outputMap'];
        this.inbound = <any>_.fromPairs(_.map(inputLabels, i => [i, false]))// as ChainComponent<any[], any[]>['inbound'];
        this.outbound = <any>_.fromPairs(_.map(outputLabels, i => [i, false]))// as ChainComponent<any[], any[]>['outbound'];
    }

    public static update(component: ChainComponent<any[], any[]>) {
        for (const val of component.update()) ;
    }

    static async load(data: ApiComponentDefinition): Promise<ChainComponent<any, any>> {
        throw 'Not implemented'
    }

    addInput<_Inputs extends string[], Outputs extends string[]>(component: ChainComponent<_Inputs, Outputs>, from: Outputs[number], to: Inputs[number]): this {
        if (component && to && to in this.inputMap && from in component.outputMap) {

            this.inputMap[to] = [component, from];
            component.outputMap[from].push([this, to]);

        } else throw `Invalid terminal`;

        return this;
    }

    abstract export(): ApiComponentDefinition;

    protected abstract propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'];

    protected* update(): Generator<ChainComponent<any[], any[]>> {
        if (ChainComponent.onUpdate)
            ChainComponent.onUpdate();

        for (const i in this.inputMap)
            this.inbound[i as Inputs[number]] = this.inputMap[i as Inputs[number]][0].outbound[this.inputMap[i as Inputs[number]][1]] ?? false;

        Object.assign(this.outbound, this.propagate(this.inbound));

        if (this.shouldBreak?.(this))
            yield this; // for use in debugging

        for (const i in this.outputMap)
            for (const [comp] of this.outputMap[i as Inputs[number]])
                for (const val of comp.update())
                    yield val;
    }

    protected onActivate(): void {
    };
}