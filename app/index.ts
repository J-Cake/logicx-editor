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

export interface GlobalState {
    actions: ActionManager,
    extensions: ExtensionManager,
    themes: ThemeManager,
    preferences: PreferenceManager<GlobalPreferences>
    viewport: ViewportManager,
}

export const GlobalState = new StateManager<GlobalState>({
    actions: new ActionManager(),
    preferences: await PreferenceManager.load(defaultPreferences),
    themes: new ThemeManager(),
    viewport: new ViewportManager()
});

const state = await GlobalState.setStateAsync(async prev => ({ extensions: await ExtensionManager.loadExtensions(prev.preferences.get('extensions')) }));

state.themes.switchTheme(state.preferences.get('theme'));

setTimeout(() => app($("section#root")[0]), 0);

export default state;