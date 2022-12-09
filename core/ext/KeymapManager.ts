import Mousetrap from 'mousetrap';

import StateManager from "#core/stateManager";
import {StateMgr} from "#core";

type ActionIdentifier = string;
type Keymap = Record<string, ActionIdentifier>;

export default class KeymapManager extends StateManager<Keymap> {
    keymaps: Record<string, Keymap> = {};
    instance: Mousetrap.MousetrapInstance

    constructor() {
        super({});
        this.instance = Mousetrap(document.body);
    }

    loadKeymap(name: string) {
        this.instance.reset();

        for (const [a, i] of Object.entries(this.setState(this.keymaps[name])))
            this.instance.bind(a, () => StateMgr.get().actions.invokeAction(i));
    }

    registerKeymap(name: string, keymap: Keymap) {
        this.keymaps[name] = keymap;
        this.instance = Mousetrap(document.body);
    }
}