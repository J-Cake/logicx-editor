import type { Extension } from "../../../core/ext/Extension.js";

import type ChainComponent from "../../circuit/chaincomponent";

import { ComponentUserAction } from "../viewport";

export const name = "chain_tool_activate";

type RegisterHandler = (name: string) => Record<ComponentUserAction, (handler: (target: ChainComponent<any, any>) => void) => void>;

export default async function (extension: Extension<{}>) {
    console.log("Activate extension");

    const chain = extension.api().getNamespace('chain');
    const on = chain.getSymbol<RegisterHandler>('register-tool')?.('activate');

    on?.click(function(target) {
        target['onActivate']();
    });
}