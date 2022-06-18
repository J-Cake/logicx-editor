import {Extension} from "../../../core/ext/Extension.js";
import {ComponentUserAction} from "../ext";
import RenderComponent from "../render/component";

export const name = "chain_tool_select";

// Async function to run once free - to ensure that chain is loaded
export default async function Ext(extension: Extension<{}>) {
    const chain = await extension.api().getNamespace("chain");

    extension.action.register('select-all', () => chain.getSymbol<RenderComponent[]>("visible")?.forEach(i => i.setState(i => ({selected: true}))), "Select All")
    extension.action.register('select-none', () => chain.getSymbol<RenderComponent[]>("visible")?.forEach(i => i.setState(i => ({selected: false}))), "Select None")

    const events = chain.getSymbol<Record<ComponentUserAction, ((handler: (component: RenderComponent) => void) => void)>>("on");

    if (events && events.click)
        events.click(function (component) {
            extension.action.invoke('chain_tool_select.select-none');
            component.setState({selected: !component.state.selected});
        });
}