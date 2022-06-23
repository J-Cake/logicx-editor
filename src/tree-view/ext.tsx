import React from 'react';

import type { Extension } from "../../core/ext/Extension";

export const name = "tree-view";

export default function (ext: Extension<{}>) {
    ext.ui.viewport(() => <div>
        Tree View
    </div>, 'Tree View');
}