import _ from "lodash";

import { GlobalState } from "..";

export type Condition = keyof ActionManager['conditions']; // The condition be will represent a list of values which define state-dependent values

export default class ActionManager {

    private readonly actions: Map<string, Partial<{ [K in Condition]: () => void }>> = new Map();

    private conditions: { [K in string]: (state: GlobalState) => boolean };

    constructor() {
        this.conditions = {};
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

    }
}