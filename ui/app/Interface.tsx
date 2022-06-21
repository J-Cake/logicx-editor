import React from "react";
import _ from 'lodash';

import StatusBar from "./StatusBar";
import ToolBar from "./ToolBar";
import Viewport from "./Viewport";

import * as Tab from '../components/tab';
import { StateMgr } from "../../core";

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
            <Tab.TabContainer active={left[left_focus].display} className="panel left">{
                _.chain(left)
                    .keyBy('display')
                    .mapValues(i => <Tab.TabView title={i.display}>
                        {i.content(i.handle())}
                    </Tab.TabView>)
                    .value() as Record<string, React.ReactElement<{title: string, children: React.ReactNode}>>}</Tab.TabContainer>
            <Viewport />
            <Tab.TabContainer active={right[right_focus].display} className="panel right">{
                _.chain(right)
                    .keyBy('display')
                    .mapValues(i => <Tab.TabView title={i.display}>
                        {i.content(i.handle())}
                    </Tab.TabView>)
                    .value() as Record<string, React.ReactElement<{title: string, children: React.ReactNode}>>}</Tab.TabContainer>
            <ToolBar actions={RightToolbar} position="right" />

            <StatusBar />
        </section>;
    }
}