// import * as Lodash from 'lodash';
// import { chain as _ } from 'lodash';

import Lodash from 'lodash';
const _ = Lodash.chain;

export default abstract class ChainComponent<Inputs extends string[], Outputs extends string[]> {

    public readonly inputMap: { [id in Inputs[number]]: [ChainComponent<any[], any[]>, string] };
    public readonly outputMap: { [id in Outputs[number]]: [ChainComponent<any[], any[]>, string][] };

    public readonly inbound: { [id in Inputs[number]]: boolean };
    public readonly outbound: { [id in Outputs[number]]: boolean };

    public shouldBreak?: (component: ChainComponent<any[], any[]>) => boolean;

    public static onUpdate?: () => void;

    protected constructor(protected inputLabels: Inputs[number][], protected outputLabels: Outputs[number][]) {
        this.inputMap = <any>Lodash.fromPairs(Lodash.map(inputLabels, i => [i, null]))// as ChainComponent<any[], any[]>['inputMap'];
        this.outputMap = <any>Lodash.fromPairs(Lodash.map(outputLabels, i => [i, []]))// as ChainComponent<any[], any[]>['outputMap'];
        this.inbound = <any>Lodash.fromPairs(Lodash.map(inputLabels, i => [i, false]))// as ChainComponent<any[], any[]>['inbound'];
        this.outbound = <any>Lodash.fromPairs(Lodash.map(outputLabels, i => [i, false]))// as ChainComponent<any[], any[]>['outbound'];
    }

    protected abstract propagate(input: ChainComponent<Inputs, Outputs>['inbound']): ChainComponent<Inputs, Outputs>['outbound'];
    protected *update(): Generator<ChainComponent<any[], any[]>> {

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

    addInput<_Inputs extends string[], Outputs extends string[]>(component: ChainComponent<_Inputs, Outputs>, from: Outputs[number], to: Inputs[number]): this {
        if (component && to && to in this.inputMap && from in component.outputMap) {

            this.inputMap[to] = [component, from];
            component.outputMap[from].push([this, to]);

        } else throw `Invalid terminal`;

        return this;
    }

    public static update(component: ChainComponent<any[], any[]>) {
        for (const val of component.update());
    }

    protected onActivate(): void {};
}