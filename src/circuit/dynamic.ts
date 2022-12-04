import _ from 'lodash';

import ChainComponent from "./chaincomponent";
import {ApiDynamicComponentDefinition} from "../../core/api/resources";
import {ComponentBuilder} from "../document/document";

type PropagateFn<Inputs extends string[], Outputs extends string[]> = (input: ChainComponent<Inputs, Outputs>["inbound"]) => ChainComponent<Inputs, Outputs>["outbound"];
type ReturnType<Input extends string[], Output extends string[]> = Promise<Partial<{ propagate: PropagateFn<Input, Output>, onActivate: ChainComponent<Input, Output>['onActivate'] }>>;
type FunctionMap<Inputs extends string[], Outputs extends string[]> = Partial<{ origin: string, propagate: PropagateFn<Inputs, Outputs>, onActivate: () => void }>;
export default abstract class Dynamic<Inputs extends string[], Outputs extends string[]> extends ChainComponent<Inputs, Outputs> {

    protected origin: string;
    protected propagate: PropagateFn<Inputs, Outputs>;

    protected constructor(inputs: Inputs, outputs: Outputs) {
        super(inputs, outputs);

        this.origin = '';
        this.propagate = (input: ChainComponent<Inputs, Outputs>["inbound"]) => _.chain(outputs)
            .map(i => [i, false])
            .fromPairs()
            .value() as any;
    }

    static async fetch<Input extends string[], Output extends string[]>(origin: string): ReturnType<Input, Output> {
        if (!origin)
            return Promise.reject(null);

        const url = new URL(origin);

        if (['http:', 'https:'].includes(url.protocol))
            return await import(origin) as any;

        else if (['javascript:', 'js:'].includes(url.protocol))
            return new Function(url.pathname)() as any;

        throw `Invalid protocol ${url.protocol}`;
    }

    static async load<Inputs extends string[], Outputs extends string[]>(data: ApiDynamicComponentDefinition<Inputs, Outputs>): Promise<ComponentBuilder<Inputs, Outputs>> {
        const {propagate, onActivate} = await Dynamic.fetch<Inputs, Outputs>(data.origin)
            .catch(function (err) {
                if (err)
                    console.error(err);

                return ({
                    propagate: () => _.fromPairs(_.map(data.outputs, i => [i, false])) as any
                }) as Awaited<ReturnType<Inputs, Outputs>>;
            });

        // @ts-expect-error ???
        return class extends Dynamic<Inputs, Outputs> {
            public static readonly component = data;

            static new(): Dynamic<Inputs, Outputs> {
                const component = new this(data.inputs, data.outputs);
                return Object.assign(component, {
                    origin: data.origin,
                    propagate: typeof propagate == 'function' ? ((...args) => propagate.call(component, ...args)) as PropagateFn<Inputs, Outputs> : component.propagate,
                    onActivate: typeof onActivate == 'function' ? (() => onActivate.call(component)) as typeof onActivate : component.onActivate
                })
            }
        };
    }

    static fromFunction<Inputs extends string[], Outputs extends string[]>(token: string, name: string, inputs: Inputs, outputs: Outputs, dynamic: string | FunctionMap<Inputs, Outputs>): ComponentBuilder<Inputs, Outputs> {
        // @ts-expect-error
        return class extends Dynamic<Inputs, Outputs> {
            private constructor(inputs: Inputs, outputs: Outputs) {
                super(inputs, outputs);

                const {
                    origin,
                    propagate,
                    onActivate
                } = (typeof dynamic == 'string' ? {origin: dynamic, ...new Function(dynamic).call(this)} : dynamic) as any;

                this.origin = origin;

                if (typeof propagate == 'function')
                    this.propagate = inputs => propagate.call(this, inputs);

                if (typeof onActivate == 'function')
                    this.onActivate = () => onActivate.call(this);
            }

            static component: ApiDynamicComponentDefinition<Inputs, Outputs> = {
                type: "Dynamic",
                origin: typeof dynamic == 'string' ? dynamic : dynamic.origin ?? 'js:return{}',
                token,
                name,
                inputs,
                outputs
            }

            static new() {
                return new this(inputs, outputs);
            }
        }
    }
}
