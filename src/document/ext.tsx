import React from 'react';
import JSON5 from 'json5';

import {Extension} from "../../core/ext/Extension";
import {PanelHandle} from "../../core/ext/ViewportManager";

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

    ctx.action.register('save-to-disk', function () {
        const current: Document = ctx.api().getNamespace('circuit').getSymbol('get-current-document')!();

        if (!current)
            return;

        const doc = JSON5.stringify(current.export('offline'));

        const blob = new Blob([doc], {type: 'application/json5'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = current.name + '.json5';
        a.click();
    });

    ctx.action.register('load-from-disk', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = function () {
            const file = input.files![0];
            const reader = new FileReader();
            reader.addEventListener('load', async function () {
                const doc = await Document.load('', JSON5.parse(reader.result as string));

                documentChangeHandlers.forEach(i => i(doc));
            });
            reader.readAsText(file);
        };
        input.click();
    });

    const documentChangeHandlers: Array<(document: Document) => void> = [];

    ctx.api().expose('on-request-document-change', (handler: (document: Document) => void) => documentChangeHandlers.push(doc => handler(doc)));
    ctx.action.register('new', function () {
        const doc = new BlankDocument();
        for (const i of documentChangeHandlers)
            i(doc);
    });

    ctx.ui.panel({label: 'Documents', icon: 'file', panel: 'left'}, (panel: PanelHandle) => <Panel ctx={ctx}/>);
}
