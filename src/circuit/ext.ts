import type { Extension } from "../../core/ext/Extension";

import type Document from "../document/document";

import Dynamic from "./dynamic";
import Stateful from "./stateful";
import Stateless from "./stateless";

export const name = "circuit";

export interface Storage {
    document?: Document
}

export default function main(ext: Extension<Storage>) {
    ext.api().expose('get-current-document', () => ext.storage().get().document);
    ext.api().expose('on-document-change', function (handler: (document: Document) => void) {
        const onChange = ext.api().getNamespace('document').getSymbol('on-request-document-change');
        
        if (onChange)
            onChange(function (doc: Document) {
                ext.storage().dispatch('document-change', { document: doc });
                handler(doc);
            });
    });

    ext.api().expose("Stateless", Stateless);
    ext.api().expose("Stateful", Stateful);
    ext.api().expose("Dynamic", Dynamic);
}