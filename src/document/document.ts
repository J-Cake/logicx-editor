import type {ApiDocument, GenericComponent} from "../../core/api/resources";
import type ChainComponent from "../circuit/chaincomponent";
import type {Wire} from "../chain-view/render/wire";

export default class Document {

    public readonly components: ChainComponent<any, any>[] = [];
    public readonly apiComponent: GenericComponent[] = [];
    public readonly wires: Wire[] = [];

    protected constructor(public readonly token: string, private readonly apiDoc: ApiDocument) {

    }

    async save(): Promise<void> {
    }

    static async load(token: string): Promise<Document> {
        return new Document(token, {
            circuitName: "",
            components: [],
            content: {},
            ownerEmail: ""
        });
    }
}