import React from 'react';

import { Extension } from "../../core/ext/Extension";
import { PanelHandle } from "../../core/ext/ViewportManager";

import Document from './document';
import BlankDocument from './blankDocument';
import Panel from './panel';

export const name = 'document';

export const extension: Extension<{}> = {} as any;

export default function (ctx: Extension<{}>) {
    Object.assign(extension, ctx);

    ctx.action.register('save', function () {
        console.log('saving');
    });

    const documentChangeHandlers: Array<(document: Document) => void> = [];

    ctx.api().expose('on-request-document-change', (handler: (document: Document) => void) => documentChangeHandlers.push(doc => handler(doc)));
    ctx.action.register('new', function () {
        const doc = new BlankDocument();
        for (const i of documentChangeHandlers)
            i(doc);
    });

    ctx.ui.panel({ label: 'Documents', icon: 'file', panel: 'left' }, (panel: PanelHandle) => <Panel ctx={ctx} />);
}