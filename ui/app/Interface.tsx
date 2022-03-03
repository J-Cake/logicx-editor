import React from "react";

import Panel from "./Panel";
import StatusBar from "./StatusBar";
import ToolBar from "./ToolBar";
import Viewport from "./Viewport";

import * as Tab from '../components/tab';
import { StateMgr } from "../../app";

export default class Interface extends React.Component<{ documentId: string }> {

    constructor(props: { documentId: string }) {
        super(props);

        const extensions = JSON.parse(window.localStorage.getItem("extensions") ?? '[]');
        StateMgr.get().viewport.on('panel-move', () => this.forceUpdate());
        StateMgr.get().viewport.on('toolbar-update', () => this.forceUpdate());
    }

    render() {
        const { left, right, left_focus, right_focus, TopToolbar, LeftToolbar, RightToolbar } = StateMgr.get().viewport.get();

        return <section id="interface">
            <ToolBar actions={TopToolbar} position="top" />

            <ToolBar actions={LeftToolbar} position="left" />
            <Panel activeTab={left_focus} position="left">{left.map(i => <Tab.TabView title={i.display} key={`panel-left-${i.display}`}>{i.content(i.handle())}</Tab.TabView>)}</Panel>
            <Viewport />
            <Panel activeTab={right_focus} position="right">{right.map(i => <Tab.TabView title={i.display} key={`panel-right-${i.display}`}>{i.content(i.handle())}</Tab.TabView>)}</Panel>
            <ToolBar actions={RightToolbar} position="right" />

            <StatusBar />
        </section>;
    }
}