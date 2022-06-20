import React from 'react';

import type { Extension } from "../../core/ext/Extension";
import Overview from './overview';

export const name = "overview";

export default function (extension: Extension<{}>) {
    extension.ui.panel({ label: "Overview", icon: "file", panel: "left" }, (panel: any) => <Overview/>);
}