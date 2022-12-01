import _ from 'lodash';

import type {ApiDocument, GenericComponent} from "../../core/api/resources";
import type ChainComponent from "../circuit/chaincomponent";
import type {Wire} from "../chain-view/render/wire";
import loadComponent from "./componentFactory";
import {extension} from "./ext";

export default class Document {

    public readonly components: ChainComponent<any, any>[] = [];
    public readonly apiComponent: GenericComponent[] = [];
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

        // make list of components used in doc avail
        const componentMap: Record<string, ChainComponent<any, any>> = _.fromPairs(await Promise.all(_.chain(apiDoc.components)
            .entries()
            .map(async ([a, i]) => [a, await (typeof i == 'string' ?
                loadComponent(i) :
                (extension.api().getNamespace('circuit').getSymbol(i.type) as any).load(i))])
            .value()));

        for (const i of apiDoc.content) {
            const component = componentMap[i.token];
            if (!component)
                throw new Error(`Component ${i.token} not found`);

            doc.apiComponent.push(i);
            doc.components.push(component);
        }

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
            components: _.chain((optimise == 'offline' ? this.components.map(i => i.export()) : this.apiComponent.map(i => i.token)) as any)
                .map(i => [typeof i == 'string' ? i : i.token, i])
                // .uniq()
                .fromPairs()
                .value(),
            content: this.apiComponent,
            ownerEmail: this.apiDoc.ownerEmail
        }
    }

    async save(): Promise<void> {
    }
}