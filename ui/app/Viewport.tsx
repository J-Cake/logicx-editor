import StateBlock from "markdown-it/lib/rules_block/state_block";
import React from "react";
import { GlobalState as state } from "../../app";

export interface ViewportProps {

}

export default class Viewport extends React.Component<ViewportProps> {
    render() {
        if (state.get().viewport.get().viewport)
            return <section id="viewport">
                {state.get().viewport.get().viewport()}
            </section>;

            return <section id="viewport">
                Editing {state.get().document.name}
            </section>
    }
}