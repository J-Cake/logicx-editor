import _ from 'lodash';

import type {
    ApiComponentDefinition,
    ApiDocument,
    ApiGenericComponent,
    RenderComponentProps,
    Wires
} from "#core/api/resources";
import type ChainComponent from "../circuit/chaincomponent";
import type {Wire} from "../chain-view/render/wire";
import loadComponent from "./componentFactory";
import {extension} from "./ext";
import {Point} from "../chain-view/vector";

export type ComponentBuilder<Inputs extends string[], Outputs extends string[]> = {
    component: ApiComponentDefinition<Inputs, Outputs>,
    ['new'](): ChainComponent<Inputs, Outputs>
}

// TODO: Refactor to keep chain components inside the list of components
export default class Document {
    readonly loaded: Record<string, ComponentBuilder<any, any>> = {};
    public readonly circuit: ChainComponent<any, any>[] = [];
    public readonly renderMap: RenderComponentProps[] = [];
    public readonly wires: Wire[] = [];

    constructor(public readonly token: string, private readonly apiDoc: ApiDocument) {

    }

    get name() {
        return this.apiDoc.circuitName;
    }

    static async load(token: string, apiDoc: ApiDocument): Promise<Document> {
        const doc = new Document(token, apiDoc);

        doc.apiDoc.circuitName = apiDoc.circuitName;
        doc.apiDoc.ownerEmail = apiDoc.ownerEmail;

        const componentMap: Record<string, ComponentBuilder<any, any>> = _.fromPairs(await Promise.all(_.chain(apiDoc.components)
            .entries()
            .map(async ([a, i]) => [a, await (typeof i == 'string' ?
                loadComponent(i) :
                (extension.api().getNamespace('circuit').getSymbol(i.type) as any).load(i))])
            .value()));

        Object.assign(doc, {loaded: componentMap});

        for (const i of apiDoc.content) {
            const component = componentMap[i.token].new();
            if (!component)
                throw new Error(`Component ${i.token} not found`);

            doc.circuit.push(component);
        }

        const wire = (wire: RenderComponentProps['wires'][number]) => wire;

        for (const [component, i] of apiDoc.content.entries())
            doc.renderMap.push({
                position: new Point(i.position[0], i.position[1]),
                token: i.token,
                chain: doc.circuit[component],
                flip: i.flip,
                direction: i.direction,
                label: i.label,
                wires: _.chain(i.wires)
                    .entries()
                    .map(([a, i]: [number, Wires[number]]) => i.map(j => wire({
                        dest: doc.circuit[a],
                        coords: j.coords.map(i => new Point(i[0], i[1])),
                        input: doc.circuit[a].inputLabels[j.inputIndex],
                        output: doc.circuit[component].outputLabels[j.outputIndex]
                    })))
                    .flatten()
                    .value() as any
            });

        for (const [a, i] of _.chain(apiDoc.content)
            .entries()
            .map(([a, i]) => [doc.circuit[Number(a)], i] as [typeof doc.circuit[number], typeof i])
            .value())
            for (const [component, connection] of _.chain(i.wires)
                .entries()
                .map(([a, i]) => [doc.circuit[Number(a)], i] as [typeof doc.circuit[number], typeof i])
                .value())
                for (const {inputIndex, outputIndex} of connection)
                    component.addInput(a, a.outputLabels[outputIndex], component.inputLabels[inputIndex]);

        doc.circuit.forEach(i => [...i.update()]);

        return doc;
    }

    static async new(token: string): Promise<Document> {
        return new Document(token, {
            circuitName: "",
            components: {},
            content: [],
            ownerEmail: ""
        });
    }

    export(optimise: 'size' | 'offline' | 'compatibility' = 'compatibility'): ApiDocument {
        const gen = (comp: ApiGenericComponent) => comp;
        const mkWire = (comp: ApiGenericComponent['wires'][number][number]) => comp;

        return {
            circuitName: this.apiDoc.circuitName,
            components: _.chain(this.loaded)
                .mapValues(i => ['size', 'compatibility'].includes(optimise) ? i.component.token : i.component)
                .value(),
            content: _.chain(this.renderMap)
                .map(i => gen({
                    direction: i.direction,
                    flip: i.flip,
                    label: i.label,
                    position: i.position.toTuple(),
                    token: i.token,
                    wires: _.chain(i.wires)
                        .map(wire => ({
                            dest: this.circuit.indexOf(wire.dest),
                            ...mkWire({
                                coords: [],
                                inputIndex: 0,
                                outputIndex: 0
                            })
                        }))
                        .groupBy('dest')
                        .mapValues(i => i.map(i => ({
                            coords: i.coords,
                            inputIndex: i.inputIndex,
                            outputIndex: i.outputIndex,
                        })))
                        .value()
                }))
                .value(),
            ownerEmail: this.apiDoc.ownerEmail
        }
    }

    async save(): Promise<void> {
    }
}
