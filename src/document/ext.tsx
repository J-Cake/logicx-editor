import React from 'react';

import { Extension } from "../../core/ext/Extension";
import { PanelHandle } from "../../core/ext/ViewportManager";

import Document from './document';
import BlankDocument from './blankDocument';
import Panel from './panel';

export const name = 'document';

export interface Ctx {
    currentDocument: Document;
}

export default function (extension: Extension<Ctx>) {
    extension.action.register('save', function () {
        console.log('saving');
    });

    extension.api().expose('on-request-document-change', (handler: (document: Document) => void) => extension.storage().on('document-change', prev => handler(prev.currentDocument)));
    extension.api().expose('get-open-document', () => extension.storage().get().currentDocument);
    extension.action.register('new', () => extension.storage().dispatch('document-change', { currentDocument: new BlankDocument() }));

    extension.ui.panel({ label: 'Documents', icon: 'file', panel: 'left' }, (panel: PanelHandle) => <Panel ctx={extension} />);
}