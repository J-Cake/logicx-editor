import $ from 'jquery';
import React from "react";
import _ from 'lodash';

import { StateMgr as StateMgr } from "../../core";

import { TabContainer, TabView } from '../components/tab';

export interface ViewportProps {

}

export default class Viewport extends React.Component<ViewportProps, { viewport: JSX.Element }> {
    ref = React.createRef<HTMLDivElement>();

    componentDidMount(): void {
        setTimeout(() => this.forceUpdate(), 0);
        StateMgr.on('theme-change', () => this.forceUpdate());
        StateMgr.get().viewport.on('viewport-change', () => this.forceUpdate());
    }

    render() {
        return <div ref={this.ref} id="viewport">
            <TabContainer>
                {_.mapValues(StateMgr.get().viewport.get().viewport, (i, a) => <TabView title={a}>
                    {i($(this.ref.current!))}
                </TabView>)}
            </TabContainer>
        </div>
    }
}