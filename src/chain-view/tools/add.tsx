import React from "react";
import _ from 'lodash';

import type {Extension} from "#core/ext/Extension";
import Menu from "#components/menu";
import type Document from "../../document/document";

export const name = 'add-menu';

export default function (ctx: Extension) {
    const AddMenu = function () {
        const doc: Document = ctx.api().getNamespace('document').getSymbol('get-current-document')!();

        if (doc)
            return <Menu children={[..._.chain(doc.loaded)
                .values()
                .map(i => ({
                    label: i.component.name,
                    action() {

                    }
                }))
                .value(), null, {
                action: () => void 0,
                label: 'Find new'
            }]}/>;

        else throw `No document loaded.`;
    };

    let menu: () => void;
    ctx.action.register('add', () => void [menu?.(), menu = ctx.ui.menu(AddMenu())]);
}