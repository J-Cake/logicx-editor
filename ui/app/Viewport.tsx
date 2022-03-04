import $ from 'jquery';
import React from "react";
import { StateMgr as StateMgr } from "../../core";

export interface ViewportProps {

}

export default class Viewport extends React.Component<ViewportProps, { viewport: JSX.Element }> {
    viewport: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount(): void {
        setTimeout(() => this.forceUpdate(), 0);
        StateMgr.on('theme-change', () => this.forceUpdate());
    }

    render() {
        const id = "viewport"; // moving to separate binding to shut it up about duplicate ID attributes
        if (StateMgr.get().viewport.get().viewport && this.viewport.current)
            return <div id={id} ref={this.viewport}>
                {StateMgr.get().viewport.get().viewport($(this.viewport.current))}
            </div>;
        else
            return <div id="viewport" ref={this.viewport}>
                Editing <i>{StateMgr.get().document.name}</i>
            </div>
    }
}