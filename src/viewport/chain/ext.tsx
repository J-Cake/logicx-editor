import React from 'react';

import type { Extension } from '../../../app/ext/Extension';

import Component from './render/component';

export const name = 'chain';

export let getValue: <T>(path: string) => T = () => null;

export default function Ext(extension: Extension) {
    getValue = extension.currentTheme;

    extension.ui.viewport(function (parent) {
        return <svg width='100%' height='100%'>
            <Component inputs={[[true, 'subtract'], [false, '1']]} outputs={[[false, 'output']]} pos={[10, 10]} />
        </svg>;
    });
}