import React from 'react';

import { Extension } from "../../core/ext/Extension";
import { PanelHandle } from "../../core/ext/ViewportManager";

import Document from './document';
import BlankDocument from './blankDocument';
import Panel from './panel';

export const name = 'document';

export const extension: Extension<Ctx> = {} as any;

export interface Ctx {
    currentDocument: Document;
}

export default function (ctx: Extension<Ctx>) {
    Object.assign(extension, ctx);
    
    ctx.action.register('save', function () {
        console.log('saving');
    });

    ctx.api().expose('on-request-document-change', (handler: (document: Document) => void) => ctx.storage().on('document-change', prev => handler(prev.currentDocument)));
    ctx.api().expose('get-open-document', () => ctx.storage().get().currentDocument);
    ctx.action.register('new', () => ctx.storage().dispatch('document-change', { currentDocument: new BlankDocument() }));

    ctx.ui.panel({ label: 'Documents', icon: 'file', panel: 'left' }, (panel: PanelHandle) => <Panel ctx={ctx} />);
}