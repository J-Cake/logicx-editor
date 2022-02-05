import React from "react";

import Panel from "./Panel";
import StatusBar from "./StatusBar";
import ToolBar from "./ToolBar";
import Viewport from "./Viewport";

import * as Tab from '../components/tab';
import { GlobalState } from "../../app";

export default class Interface extends React.Component<{ documentId: string }> {

    constructor(props) {
        super(props);

        const extensions = JSON.parse(window.localStorage.getItem("extensions"));
    }

    render() {
        const { left, right, left_focus, right_focus } = GlobalState.get().viewport.get();

        return <section id="interface">
            <ToolBar actions={[]} position="top" />

            <ToolBar actions={[]} position="left" />
            <Panel activeTab={left_focus} position="left">{left.map(i => <Tab.TabView title={i.display} key={`panel-left-${i.display}`}>{i.content()}</Tab.TabView>)}</Panel>
            <Viewport />
            <Panel activeTab={right_focus} position="right">{right.map(i => <Tab.TabView title={i.display} key={`panel-right-${i.display}`}>{i.content()}</Tab.TabView>)}</Panel>
            <ToolBar actions={[]} position="right" />

            <StatusBar />
        </section>;
    }
}