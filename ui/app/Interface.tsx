import $ from 'jquery';
import React from "react";
import _ from 'lodash';

import StatusBar from "./StatusBar";
import ToolBar from "./ToolBar";
import Viewport from "./Viewport";

import * as Tab from '../components/tab';
import { StateMgr } from "../../core";
import StatusItem from "./private/status";

export default class Interface extends React.Component<{ documentId: string }, { leftPanel: boolean, rightPanel: boolean, leftSize: number, rightSize: number }> {
    constructor(props: { documentId: string }) {
        super(props);

        this.state = {
            leftPanel: true,
            rightPanel: true,
            leftSize: 256,
            rightSize: 256
        };

        const extensions = JSON.parse(window.localStorage.getItem("extensions") ?? '[]');
        StateMgr.get().viewport.on('panel-move', () => this.forceUpdate());
        StateMgr.get().viewport.on('toolbar-update', () => this.forceUpdate());
    }

    private altLeft(size: number) {
        this.setState({ leftSize: Math.max(0, this.state.leftSize + size) });
        $(document.body).css('--panel-left-size', `${this.state.leftSize}px`);
    }

    private altRight(size: number) {
        this.setState({ rightSize: Math.max(0, this.state.rightSize - size) });
        $(document.body).css('--panel-right-size', `${this.state.rightSize}px`);
    }

    start = (e: React.MouseEvent, onResize: (size: number) => void) => (x => $(document.body).on('mousemove', x).on('mouseup', e => $(document.body).off('mousemove', x)))((e: JQuery.MouseMoveEvent) => this.onMove(e, onResize));
    onMove = (e: JQuery.MouseMoveEvent, onResize: (size: number) => void) => onResize(e.originalEvent?.movementX! ?? 0);

    render() {
        const { left, right, left_focus, right_focus, TopToolbar, LeftToolbar, RightToolbar, Statusbar: { left: StatusLeft, right: StatusRight } } = StateMgr.get().viewport.get();

        return <section id="interface" className={`${this.state.leftPanel ? 'panel-left' : ''} ${this.state.rightPanel ? 'panel-right' : ''}`}>
            <ToolBar actions={TopToolbar} position="top" />

            <ToolBar actions={LeftToolbar} position="left" />
            {this.state.leftPanel ? <><Tab.TabContainer
                active={left[left_focus].display}
                className="panel left">{
                    _.chain(left)
                        .keyBy('display')
                        .mapValues(i => <Tab.TabView title={i.display}>
                            {i.content(i.handle())}
                        </Tab.TabView>)
                        .value() as Record<string, React.ReactElement<{ title: string, children: React.ReactNode }>>}
            </Tab.TabContainer>
                <div className='logicx-widgets splitter' onMouseDown={e => this.start(e, size => this.altLeft(size))} />
            </> : null}

            <Viewport />

            {this.state.rightPanel ? <>
                <div className='logicx-widgets splitter' onMouseDown={e => this.start(e, size => this.altRight(size))} />
                <Tab.TabContainer
                    active={right[right_focus].display}
                    className="panel right">{
                        _.chain(right)
                            .keyBy('display')
                            .mapValues(i => <Tab.TabView title={i.display}>
                                {i.content(i.handle())}
                            </Tab.TabView>)
                            .value() as Record<string, React.ReactElement<{ title: string, children: React.ReactNode }>>}
                </Tab.TabContainer>
            </> : null}
            <ToolBar actions={RightToolbar} position="right" />

            <StatusBar>
                {{
                    left: [
                        <StatusItem label={''} icon={<i className="ri-layout-left-2-fill"></i> as any}>{() => (this.setState(prev => ({ leftPanel: !prev.leftPanel })), null)}</StatusItem>,
                        ...StatusLeft.map(i => <StatusItem label={i.display} icon={i.icon}>{i.content}</StatusItem>)
                    ],
                    right: [
                        ...StatusRight.map(i => <StatusItem label={i.display} icon={i.icon}>{i.content}</StatusItem>),
                        <StatusItem label={''} icon={<i className="ri-layout-right-2-fill"></i> as any}>{() => (this.setState(prev => ({ rightPanel: !prev.rightPanel })), null)}</StatusItem>,
                    ]
                }}
            </StatusBar>
        </section>;
    }
}