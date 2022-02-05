import { GlobalState, GlobalState as state } from "..";
import { Condition } from "./ActionManager";
import { Theme } from "./ThemeManager";
import ViewportManager from "./ViewportManager";

export default class Extension {
    constructor (public readonly name: string, private readonly onLoad: (extension: Extension) => void) {

    }

    registerAction(name: string, condition: Condition, action: () => void) {

    }

    registerTheme(name: string, theme: Theme) {
        state.get().themes.pushTheme(theme, name);
    }

    getViewport(): ViewportManager {
        return state.get().viewport;
    }
}