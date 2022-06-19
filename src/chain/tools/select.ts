import { Extension } from "../../../core/ext/Extension.js";
import ChainComponent from "../chaincomponent.js";
import { ComponentUserAction } from "../viewport.js";

export const name = "chain_tool_select";

type RegisterHandler = (name: string) => Record<ComponentUserAction, (handler: (target: ChainComponent<any, any>) => void) => void>;

// Async function to run once free - to ensure that chain is loaded
export default async function Ext(extension: Extension<{}>) {
    const chain = extension.api().getNamespace('chain');
    const on = chain.getSymbol<RegisterHandler>('register-tool')?.('select');
    const emit = chain.getSymbol<(event: ComponentUserAction, target: ChainComponent<any, any>) => void>('emit-event');
    const select = chain.getSymbol<{
        toggle(...components: ChainComponent<any, any>[]): void,
        expand(...components: ChainComponent<any, any>[]): void,
        reduce(...components: ChainComponent<any, any>[]): void,
           set(...components: ChainComponent<any, any>[]): void,
         clear(...components: ChainComponent<any, any>[]): void,
    }>('select')

    on?.click(function (target) {
        select?.set(target);
        emit?.('select', target);
    });

    extension.action.register('select-all', () => console.warn('Not implemented yet'), "Select All")
    extension.action.register('select-none', () => select?.clear(), "Select None")

    // const events = extension.api().getNamespace("chain").getSymbol<Record<ComponentUserAction, ((handler: (component: RenderComponent) => void) => void)>>("on");

    // if (events && events.click)
    //     events.click(function (component) {
    //         extension.action.invoke('chain_tool_select.select-none');
    //         component.setState({selected: !component.state.selected});
    //     });
}