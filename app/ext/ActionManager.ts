import _ from "lodash";

import { GlobalState, GlobalState as state } from "..";

export type Condition = keyof ActionManager['conditions']; // The condition be will represent a list of values which define state-dependent values

export default class ActionManager {

    private readonly actions: Map<string, Partial<{ [K in Condition]: () => void | Promise<void> }>> = new Map();
    private queue: [job: Promise<any>, label: string][];

    readonly conditions: { [K in string]: (state: GlobalState) => boolean };

    constructor() {
        this.conditions = { always: () => true, never: () => false };
    }

    conditionIsMet(condition: Condition): boolean {
        return this.conditions[condition](GlobalState.setState());
    }

    registerAction(name: string, condition: Condition, action: () => void) {
        if (this.actions.has(name)[condition])
            throw new Error(`Action ${name} already exists`);

        const entry = this.actions.get(name) ?? {};
        this.actions.set(name, _.merge(entry, { [condition]: action }));
    }

    invokeAction(name: string) {
        const action = this.actions.get(name);

        for (const i in action)
            if (this.conditionIsMet(i)) {
                const job = action[i]();

                if (job instanceof Promise)
                    this.queue.push([job.then(() => this.queue.splice(this.queue.findIndex(i => i[0] === job), 1)), name]);
            }

    }
}