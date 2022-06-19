import type {ApiDocument, GenericComponent} from "../../core/api/resources";
import type ChainComponent from "../chain/chaincomponent";
import type {Wire} from "../chain/render/wire";

export default class Document {

    public readonly components: ChainComponent<any, any>[] = [];
    public readonly apiComponent: GenericComponent[] = [];
    public readonly wires: Wire[] = [];

    protected constructor(public readonly token: string, doc: ApiDocument) {

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