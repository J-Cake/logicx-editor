import _ from "lodash";

export class ActionNamespace {

    private readonly actions: { name: string, enabled: boolean, action: () => void }[];
    private children: { [name in string]: ActionNamespace };

    constructor(public readonly name: string, private readonly parent?: ActionNamespace) {
        this.actions = [];
        this.children = {};

        if (parent && name in parent.children)
            throw 'Action namespace already exists';
        else if (parent)
            parent.children[name] = this;
    }

    register(name: string, action: () => void): (enabled: boolean) => void {
        if (name.includes('.'))
            throw `Action name cannot contain '.'`;

        const actionObject = { name, enabled: true, action };
        this.actions.push(actionObject);

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

        this.namespaces[search[0]].invoke(search.slice(1).join('.'));
    }
}