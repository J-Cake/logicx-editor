import _ from 'lodash';

import type {ApiComponentDefinition, ApiDocument, GenericComponent} from "#core/api/resources";
import type ChainComponent from "../circuit/chaincomponent";
import type {Wire} from "../chain-view/render/wire";
import loadComponent from "./componentFactory";
import {extension} from "./ext";

export type ComponentBuilder<Inputs extends string[], Outputs extends string[]> = {
    component: ApiComponentDefinition<Inputs, Outputs>,
    ['new'](): ChainComponent<Inputs, Outputs>
}

export default class Document {
    readonly loaded: Record<string, ComponentBuilder<any, any>> = {};
    public readonly circuit: ChainComponent<any, any>[] = [];
    public readonly renderMap: GenericComponent[] = [];
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

            doc.renderMap.push(i);
            doc.circuit.push(component);
        }

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
        return {
            circuitName: this.apiDoc.circuitName,
            components: _.chain(this.loaded)
                .mapValues(i => ['size', 'compatibility'].includes(optimise) ? i.component.token : i.component)
                .value(),
            content: this.renderMap,
            ownerEmail: this.apiDoc.ownerEmail
        }
    }

    async save(): Promise<void> {
    }
}
