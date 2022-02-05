import React from "react";

import Panel from "./Panel";
import StatusBar from "./StatusBar";
import ToolBar from "./ToolBar";
import Viewport from "./Viewport";

export default class Interface extends React.Component<{ documentId: string }> {

    constructor(props) {
        super(props);

        const extensions = JSON.parse(window.localStorage.getItem("extensions"));
    }

    render() {
        return <section id="interface">
            <ToolBar actions={[]} position="top"/>

            <ToolBar actions={[]} position="left"/>
            <Panel activeTab={0} position="left"></Panel>
            <Viewport />
            <Panel activeTab={0} position="right"></Panel>
            <ToolBar actions={[]} position="right"/>

            <StatusBar/>
        </section>;
    }
}