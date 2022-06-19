import {StateMgr as StateMgr} from "..";
import StateManager from "../stateManager";
import {ActionNamespace} from "./ActionManager";
import ThemeManager, {Colour, colour} from "./ThemeManager";
import ViewportManager from "./ViewportManager";
import {query} from "../api/interfaces";

export interface ExtensionAPI<K extends Record<string, any>> {
    expose<T extends K[string]>(name: string, object: T): T,

    getSymbol<T extends K[string]>(symbol: string): T | null,

    getNamespace<K extends Record<string, any>>(namespace: string): ExtensionAPI<K>

    require<T>(symbol: string): T,
}

export const APIs: Record<string, Map<keyof Record<string, any>, any>> = {};

export function extensionAPI<K extends Record<string, any>>(this: { name: string }): ExtensionAPI<K> {
    const getApiInterface = function (objects: Map<keyof K, any>): ExtensionAPI<K> {
        return {
            expose<Name extends keyof K>(name: Name, object: K[Name]): typeof object {
                if (!(name as string).includes('.')) {
                    objects.set(name, object);
                    return object;
                } else throw `Extension APIs cannot expose an object with a dot in its name`;
            },
            getSymbol: <Name extends keyof K>(symbol: Name): K[Name] => objects.has(symbol) ? objects.get(symbol) : null,
            getNamespace: <K extends Record<string, any>>(namespace: string): ExtensionAPI<K> => getApiInterface(APIs[namespace] ?? null),
            require: <T>(symbol: string): T => StateMgr.get().extensions.findAPISymbol(symbol)
        }
    }

    return getApiInterface(APIs[this.name] = new Map());
}

export interface Extension<T extends {} = any> {
    action: {
        invoke(name: string): void,
        getNamespace(): ActionNamespace,
        register: ActionNamespace['register'],
        details: ActionNamespace['details'],
        fork: ActionNamespace['fork'],
        listAll: ActionNamespace['listAll']
    },

    ui: {
        viewport(viewport: (parent: JQuery) => JSX.Element): void,
        panel: ViewportManager['addPanelItem'],
        theme: ThemeManager['pushTheme']
    },

    util: {
        colour(colour: string | [string, string]): Colour | [Colour, Colour]
    },

    resource: typeof query,

    storage: () => StateManager<T>,
    api: <K extends Record<string, any>>() => ExtensionAPI<K>,

    currentTheme: <T>(path: string) => T
}

export default function Extension<T extends {} = any>(name: string, onLoad: (extension: Extension<T>) => void): Extension<T> {
    const state = StateMgr.get();
    const actionNamespace: ActionNamespace = state.actions.pushNamespace(name);
    const api = extensionAPI.bind({name: name})();

    const sharedState = new StateManager<T>({}); // TODO: Find a way to store these such that each can be retrieved. Extension IDs for example
    const storage = () => sharedState;

    function parse(colourValue: string): Colour;
    function parse(colourValue: [string, string]): [Colour, Colour];
    function parse(colourValue: string | [string, string]): Colour | [Colour, Colour] {
        const parseColour = function (colourValue: string): Colour {
            if (colourValue.startsWith('#') && (colourValue.length === 7 || colourValue.length === 9))
                return colour(...colourValue.slice(1).split(/(..)/).filter(i => i).map(i => parseInt(i, 16)) as [number, number, number, number?]);
            else
                throw `Invalid Colour Format: Expected rgb (#rrggbb) or rgba (#rrggbbaa)`;
        };

        if (typeof colourValue === 'string') {
            return parseColour(colourValue);
        } else {
            return [parseColour(colourValue[0]), parseColour(colourValue[1])];
        }
    }

    return {
        action: {
            invoke: name => state.actions.invokeAction(name),
            getNamespace: () => actionNamespace,
            details: (name: string) => state.actions.details(name),
            register: actionNamespace.register.bind(actionNamespace),
            fork: actionNamespace.fork.bind(actionNamespace),
            listAll: actionNamespace.listAll.bind(actionNamespace)
        },

        ui: {
            viewport(viewport: (parent: JQuery) => JSX.Element) {
                if (typeof viewport === 'function')
                    state.viewport.setState({viewport: viewport});
                else throw `Expected viewport to be a function`;
            },
            panel: state.viewport.addPanelItem.bind(state.viewport),
            theme: state.themes.pushTheme.bind(state.themes)
        },

        storage: () => storage()!,

        api: () => api,

        util: {
            colour: parse
        },

        resource: query,

        currentTheme: state.themes.getValue.bind(state.themes)
    };
}