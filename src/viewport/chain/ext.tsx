import React from 'react';

import type { Extension } from '../../../app/ext/Extension';
import StateManager from '../../../app/stateManager';

import Component from './render/component';

// @ts-ignore
import glob from './glob.css';

export const name = 'chain';

// export let getValue: <T>(path: string) => T = () => null;

export const StateMgr = new StateManager<{
    zoom: number,
    pan: [number, number],
    grid: boolean,

    gridSize: number,

    getValue: <T>(path: string) => T,
}>({ zoom: 1, pan: [0, 0], gridSize: 35, grid: false, getValue: () => null });

export default function Ext(extension: Extension) {
    StateMgr.setState({ getValue: extension.currentTheme });

    extension.ui.viewport(function (parent) {
        return <svg width='100%' height='100%'>
            <style>{glob}</style>
            <Component inputs={[[true, 'subtract'], [false, '1']]} outputs={[[false, 'output']]} pos={[0, 0]} label='test' />
        </svg>;
    });
}