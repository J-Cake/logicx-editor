import React from 'react';
import JSON5 from 'json5';

import {Extension} from "#core/ext/Extension";
import {PanelHandle} from "#core/ext/ViewportManager";

import Document from './document';
import BlankDocument from './blankDocument';
import Panel from './panel';

export const name = 'document';

export const extension: Extension<Storage> = {} as any;
export interface Storage {
    document?: Document,
    docChangeListeners: Array<(doc: Document) => void>
}

export function setActiveDocument(this: Extension<Storage>, doc: Document) {
    this.storage().dispatch('switch-document', {
        document: doc
    });
}

export default function (ctx: Extension<Storage>) {
    ctx.storage().setState({docChangeListeners: []});
    Object.assign(extension, ctx);

    ctx.action.register('save', function () {
        console.log('saving');
    });

    ctx.action.register('save-to-disk', function () {
        const current: Document = ctx.api().getNamespace('document').getSymbol('get-current-document')!();

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
            reader.addEventListener('load', async () => setActiveDocument.call(ctx, await Document.load('', JSON5.parse(reader.result as string))));
            reader.readAsText(file);
        };
        input.click();
    });

    ctx.action.register('new', () => setActiveDocument.call(ctx, new BlankDocument()));
    ctx.api().expose('get-current-document', () => ctx.storage().get().document);
    ctx.api().expose('on-document-change', (changeHandler: (doc: Document) => void) => ctx.storage().setState(prev => ({docChangeListeners: [...prev.docChangeListeners, changeHandler]})))

    ctx.storage().on('switch-document', state => state.docChangeListeners.forEach(i => i(state.document!)));

    ctx.ui.panel({label: 'Documents', icon: 'file', panel: 'left'}, (panel: PanelHandle) => <Panel ctx={ctx}/>);
}
