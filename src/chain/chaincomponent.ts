// import * as Lodash from 'lodash';
// import { chain as _ } from 'lodash';

import Lodash from 'lodash';
const _ = Lodash.chain;

export default abstract class ChainComponent<shape extends { inputs: string[], outputs: string[] }> {

    public readonly inputMap: { [id in shape['inputs'][number]]: [ChainComponent<any>, string] };
    public readonly outputMap: { [id in shape['outputs'][number]]: [ChainComponent<any>, string][] };

    private readonly inbound: { [id in shape['inputs'][number]]: boolean };
    public outbound: { [id in shape['outputs'][number]]: boolean };

    public shouldBreak?: (component: this) => boolean;

    protected constructor(inputs: shape['inputs'][number][], outputs: shape['outputs'][number][]) {
        this.inputMap = Lodash.fromPairs(Lodash.map(inputs, i => [i, null])) as ChainComponent<shape>['inputMap'];
        this.outputMap = Lodash.fromPairs(Lodash.map(outputs, i => [i, []])) as ChainComponent<shape>['outputMap'];
        this.inbound = Lodash.fromPairs(Lodash.map(inputs, i => [i, false])) as ChainComponent<shape>['inbound'];
        this.outbound = Lodash.fromPairs(Lodash.map(outputs, i => [i, false])) as ChainComponent<shape>['outbound'];
    }

    abstract propagate(input: boolean[]): boolean[];
    *update(): Generator<this> {
        for (const i in this.inputMap)
            this.inbound[i] = this.inputMap[i][0].outbound[this.inputMap[i][1]] ?? false;

        this.outbound = _(this.outbound)
            .keys()
            .zip(this.propagate(Lodash.values(this.inbound)))
            .fromPairs()
            .value() as typeof this.outbound;

        if (this.shouldBreak?.(this))
            yield this; // for use in debugging

        for (const i in this.outputMap)
            for (const [comp] of this.outputMap[i])
                for (const val of comp.update())
                    yield val;
    }

    addInput<T extends { inputs: string[], outputs: string[] }>(component: ChainComponent<T>, from: T['outputs'][number], to: shape['inputs'][number]): this {
        if (component && to && to in this.inputMap && from in component.outputMap) {

            this.inputMap[to] = [component, from];
            component.outputMap[from].push([this, to]);

        } else throw `Invalid terminal`;

        return this;
    }
}