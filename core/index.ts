import $ from 'jquery';

import ActionManager from './ext/ActionManager';
import ExtensionManager from './ext/ExtensionManager';
import PreferenceManager, { GlobalPreferences } from './ext/PreferenceManager';
import ThemeManager from './ext/ThemeManager';
import StateManager from './stateManager';

// @ts-ignore
import defaultPreferences from './default.lpf';
import ViewportManager, { ActionItem } from './ext/ViewportManager';
import LogicXDocument from './Document';
import app from '../ui/index';
import KeymapManager from "#core/ext/KeymapManager";

export interface GlobalState {
    actions: ActionManager,
    extensions: ExtensionManager,
    themes: ThemeManager,
    preferences: PreferenceManager<GlobalPreferences>
    viewport: ViewportManager,
    keymap: KeymapManager

    document: LogicXDocument
}

export const StateMgr = new StateManager<GlobalState>({
    actions: new ActionManager(),
    preferences: await PreferenceManager.load(defaultPreferences),
    themes: new ThemeManager(),
    viewport: new ViewportManager(),
    document: new LogicXDocument('<anonymous>', ''),
    keymap: new KeymapManager()
});

const state = await StateMgr.setStateAsync(async prev => ({ extensions: await ExtensionManager.loadExtensions(prev.preferences.get('extensions')) }));

state.themes.switchTheme(state.preferences.get('theme'));

const { actions, viewport } = StateMgr.get();
viewport.setState({
    LeftToolbar: StateMgr.get().preferences.get("toolbarLeft").map(i => actions.details(i)).filter(i => i) as ActionItem[],
    RightToolbar: StateMgr.get().preferences.get("toolbarRight").map(i => actions.details(i)).filter(i => i) as ActionItem[],
    TopToolbar: StateMgr.get().preferences.get("toolbarTop").map(i => actions.details(i)).filter(i => i) as ActionItem[],
});

state.keymap.loadKeymap(StateMgr.get().preferences.get('keymap'));

setTimeout(() => StateMgr.broadcast('ready'), 0);

StateMgr.on('ready', () => app($("section#root")[0]));