import _ from "lodash";

import { StateMgr } from "..";
import { ActionItem } from "./ViewportManager";

export type ActionTree = {
    [namespace in string]: {
        actions: Record<keyof ActionNamespace['actions'], ActionItem>,
        namespaces: ActionTree
    }
};

export class ActionNamespace {
    private readonly actions: { [name in string]: ActionItem & { action: () => void } };
    private children: { [name in string]: ActionNamespace };

    listAll(): ActionTree {
        return StateMgr.get().actions.list();
    }

    constructor(public readonly name: string, private readonly parent?: ActionNamespace) {
        this.actions = {};
        this.children = {};

        if (parent && name in parent.children)
            throw 'Action namespace already exists';
        else if (parent)
            parent.children[name] = this;
    }

    getName(name: string): string {
        return this.parent ? this.parent.getName(`${this.name}.${name}`) : `${this.name}.${name}`;
    }

    register(name: string, action: () => void, friendly?: string): (enabled: boolean) => void {
        if (name.includes('.'))
            throw `Action name cannot contain '.'`;

        const actionObject = { 
            name: this.getName(name), 
            enabled: true, action, 
            friendly,
            invoke: () => action()
        };
        this.actions[name] = actionObject;

        return enabled => actionObject.enabled = enabled;
    }

    fork(name: string): ActionNamespace {
        return new ActionNamespace(name, this);
    }

    invoke(name: string) {
        const search = name.split('.');

        if (search.length === 1)
            if (name in this.actions) {
                if (this.actions[name].enabled)
                    this.actions[name].action();
            } else throw `Action '${name}' does not exist`;
        else
            if (search[0] in this.children)
                this.children[search[0]].invoke(search.slice(1).join('.'));
            else
                throw `Action namespace '${search[0]}' does not exist`;
    }

    details(name: string): ActionItem | null {
        if (typeof name !== 'string' || name.length <= 0)
            throw `Invalid action`;

        const search = name.split('.');

        if (search.length === 1)
            if (name in this.actions) {
                if (this.actions[name].enabled)
                    return this.actions[name];
            } else return null;
        else
            if (search[0] in this.children)
                return this.children[search[0]].details(search.slice(1).join('.'));
            else
                return null;

        throw `Invalid namespace specifier`;
    }

    list(): ActionTree[string] {
        return {
            actions: _.mapValues(this.actions, i => ({
                name: i.name,
                friendly: i.friendly,
                icon: i.icon,
                enabled: i.enabled,
                shortcut: i.shortcut,
                invoke: () => i.invoke()
            })),
            namespaces: _.mapValues(this.children, i => i.list())
        }
    }
}

export default class ActionManager {

    private readonly namespaces: { [namespace in string]: ActionNamespace };
    private queue: [job: Promise<any>, label: string][];

    constructor() {
        this.namespaces = {}
        this.queue = [];
    }

    // TODO: Define some sort of conditional system

    pushNamespace(name: string): ActionNamespace {
        if (!name.includes('.'))
            return this.namespaces[name] = new ActionNamespace(name);
        else
            throw `Namespace name cannot contain '.'`;
    }

    invokeAction(name: string) {
        const search = name.split('.');

        if (search[0] in this.namespaces)
            this.namespaces[search[0]].invoke(search.slice(1).join('.'));

        else throw `Action namespace '${search[0]}' does not exist`;
    }

    details(name: string): ActionItem | null {
        if (typeof name !== 'string' || name.length === 0)
            throw `Invalid action`;

        const search = name.split('.');

        if (search[0] in this.namespaces)
            return this.namespaces[search[0]].details(search.slice(1).join('.'));

        return null;
    }

    list(): ActionTree {
        const tree: ActionTree = {};

        for (const namespace in this.namespaces)
            tree[namespace] = this.namespaces[namespace].list();

        return tree;
    }
}