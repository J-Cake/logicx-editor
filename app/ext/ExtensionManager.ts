import StateManager from "../stateManager";
import Extension from "./Extension";

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
        // unsafe. I know. stfu
        new Function('extension', await (await fetch(manifest)).text())(function (name, onLoad) {
            if (name in this.extensions)
                throw `Extension ${name} already exists`;

            const ext = this.extensions[name] = new Extension(name, onLoad);
            this.sharedState.set(name, new StateManager({}));

            onLoad(ext);
        }.bind(this));
    }

    static async loadExtensions(extensions: string[]): Promise<ExtensionManager> {
        const manager = new ExtensionManager();

        for (const i of extensions)
            await manager.loadExtension(i);

        return manager;
    }
}