import React from 'react';

import type { Extension } from "../../core/ext/Extension";
import Dropdown from '../../ui/components/dropdown-view';

import ComponentType from './ComponentType';
import Flat from './Flat';
import Tree from './Tree';

export const name = "overview";

export type Pages = 'Component Type' | 'Flat' | 'Tree';

export const extension: Extension<{}> = {} as any;

export default function (ext: Extension<{}>) {
    Object.assign(extension, ext);

    ext.ui.panel({ label: "Overview", icon: "file", panel: "left" }, (panel: any) => <Dropdown<Pages> label="View">{{
        'Component Type': [<ComponentType key='component-type'/>],
        'Flat': [<Flat key='flat'/>],
        'Tree': [<Tree key='tree'/>]
    }}</Dropdown>);
}