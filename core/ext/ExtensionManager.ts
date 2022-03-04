import React from "react";

import StateManager from "../stateManager";
import extension, { Extension } from "./Extension";

export default class ExtensionManager {
    private readonly extensions: { [Name in string]: Extension };

    public readonly sharedState: Map<keyof ExtensionManager['extensions'], StateManager<any>>;

    constructor() {
        this.extensions = {};
        this.sharedState = new Map();
    }

    get(name: string): Extension {
        return this.extensions[name];
    }

    async loadExtension(manifest: string): Promise<void> {
        const { default: ext, name } = await import(manifest);

        if (typeof ext !== 'function')
            throw `Extension ${name} must provide a default export`;

        if (typeof name !== 'string' || name.length === 0)
            throw `Extension ${name} must provide a name`;

        if (name in this.extensions)
            throw `Extension ${name} already exists`;

        const extInstance = this.extensions[name] = extension(name, ext);
        this.sharedState.set(name, new StateManager({}));

        new Promise(ok => ok(ext(extInstance, React))); // load each asynchronously
    }

    static async loadExtensions(extensions: string[]): Promise<ExtensionManager> {
        const manager = new ExtensionManager();

        for (const i of extensions)
            await manager.loadExtension(i);

        return manager;
    }

    findAPISymbol<T>(symbol: string): T {
        const namespaces = symbol.split('.');

        const extension = this.extensions[namespaces.shift()!];

        if (!extension)
            throw `Extension ${symbol} does not exist`;

        return extension.api().getSymbol<T>(namespaces.join('.'))!;
    }
}