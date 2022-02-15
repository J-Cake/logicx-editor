import $ from 'jquery';
import React from "react";
import { StateMgr as StateMgr } from "../../app";

export interface ViewportProps {

}

export default class Viewport extends React.Component<ViewportProps, { viewport: JSX.Element }> {
    viewport: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount(): void {
        setTimeout(() => this.forceUpdate(), 0);
    }

    render() {
        if (StateMgr.get().viewport.get().viewport && this.viewport.current)
            return <div id="viewport" ref={this.viewport}>
                {StateMgr.get().viewport.get().viewport($(this.viewport.current))}
            </div>;

        return <div id="viewport" ref={this.viewport}>
            Editing <i>{StateMgr.get().document.name}</i>
        </div>
    }
}