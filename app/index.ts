import $ from 'jquery';

import ActionManager from './ext/ActionManager';
import ExtensionManager from './ext/ExtensionManager';
import PreferenceManager, { GlobalPreferences } from './ext/PreferenceManager';
import ThemeManager from './ext/ThemeManager';
import StateManager from './stateManager';

// @ts-ignore
import defaultPreferences from './default.lpf';
import app from '../ui/';
import ViewportManager from './ext/ViewportManager';
import LogicXDocument from './Document';

export interface GlobalState {
    actions: ActionManager,
    extensions: ExtensionManager,
    themes: ThemeManager,
    preferences: PreferenceManager<GlobalPreferences>
    viewport: ViewportManager,

    document: LogicXDocument
}

export const GlobalState = new StateManager<GlobalState>({
    actions: new ActionManager(),
    preferences: await PreferenceManager.load(defaultPreferences),
    themes: new ThemeManager(),
    viewport: new ViewportManager(),
    document: new LogicXDocument('<anonymous>', '')
});

const state = await GlobalState.setStateAsync(async prev => ({ extensions: await ExtensionManager.loadExtensions(prev.preferences.get('extensions')) }));

state.themes.switchTheme(state.preferences.get('theme'));

setTimeout(() => app($("section#root")[0]), 0);