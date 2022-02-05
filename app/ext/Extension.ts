import { GlobalState, GlobalState as state } from "..";
import StateManager from "../stateManager";
import { Condition } from "./ActionManager";
import { Theme } from "./ThemeManager";

// Class which sanitises functions and prepares them to be called from within extensions
export default class Extension {
    constructor(public readonly name: string, private readonly onLoad: (extension: Extension) => void) {

    }

    getStorage<T>(): StateManager<T> {
        return state.get().extensions.sharedState.get(this.name) as StateManager<T>;
    }

    registerAction(name: string, condition: Condition, action: () => void) {
        state.get().actions.registerAction(name, condition, action);
    }

    invokeAction(name: string) {
        state.get().actions.invokeAction(name);
    }

    defineCondition(name: string, condition: (state: GlobalState) => boolean) {
        if (name in state.get().actions.conditions)
            throw 'Condition already exists';
        state.get().actions.conditions[name] = condition;
    }

    registerTheme(name: string, theme: Theme) {
        state.get().themes.pushTheme(theme, name);
    }

    setViewport(viewport: () => JSX.Element) {
        state.get().viewport.setState({ viewport: viewport });
    }

    registerPanel(panel: { label: string, icon?: string }, content: () => JSX.Element) {
        return state.get().viewport.addPanelItem(panel, content);
    }
}