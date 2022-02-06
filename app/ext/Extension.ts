import { StateMgr as StateMgr } from "..";
import StateManager from "../stateManager";
import { ActionNamespace } from "./ActionManager";
import { Theme } from "./ThemeManager";
import { PanelHandle } from "./ViewportManager";

// Class which sanitises functions and prepares them to be called from within extensions
export default class Extension<T = any> {
    private actionNamespace: ActionNamespace;

    constructor(public readonly name: string, private readonly onLoad: (extension: Extension<T>) => void) {
        this.actionNamespace = StateMgr.get().actions.pushNamespace(name);
    }

    storage(): StateManager<T> {
        return StateMgr.get().extensions.sharedState.get(this.name) as StateManager<T>;
    }

    actions(): ActionNamespace {
        return this.actionNamespace;
    }

    invoke(name: string) {
        StateMgr.get().actions.invokeAction(name);
    }

    theme(name: string, theme: Theme) {
        StateMgr.get().themes.pushTheme(theme, name);
    }

    viewport(viewport: () => JSX.Element) {
        if (typeof viewport === 'function')
            StateMgr.get().viewport.setState({ viewport: viewport });
        else throw `Expected viewport to be a function`;
    }

    panel(panel: { label: string, icon?: string }, content: (panel: PanelHandle) => JSX.Element): PanelHandle {
        return StateMgr.get().viewport.addPanelItem(panel, content);
    }
}