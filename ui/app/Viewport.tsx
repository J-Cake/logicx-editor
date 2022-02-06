import StateBlock from "markdown-it/lib/rules_block/state_block";
import React from "react";
import { StateMgr as StateMgr } from "../../app";

export interface ViewportProps {

}

export default class Viewport extends React.Component<ViewportProps> {
    render() {
        if (StateMgr.get().viewport.get().viewport)
            return <section id="viewport">
                {StateMgr.get().viewport.get().viewport()}
            </section>;

            return <section id="viewport">
                Editing {StateMgr.get().document.name}
            </section>
    }
}