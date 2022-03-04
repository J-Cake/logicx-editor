import React from 'react';
import { StateMgr } from '../../core';

import * as Tab from '../components/tab';

type Props = { children?: React.ReactElement<{ title: string }>[], activeTab: number, position: 'left' | 'right' };
export default class Panel extends React.Component<Props, { activeTab: number }> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeTab: this.props.activeTab
        };

        StateMgr.get().viewport.onStateChange(state => this.props.position === 'left' ? this.setState({ activeTab: state.left_focus }) : this.setState({ activeTab: state.right_focus }));
    }

    render() {
        if (this.props.children?.length! > 0)
            if (this.props.children![this.state.activeTab])
                return <Tab.TabContainer activeTab={this.state.activeTab} class={['panel', this.props.position]} onChange={active => this.setState({ activeTab: active })} group={`tab-group-${this.props.position}`}>
                    {this.props.children! ?? null}
                </Tab.TabContainer>;
            else {
                this.setState({ activeTab: 0 });

                return <Tab.TabContainer activeTab={0} class={['panel', this.props.position]} onChange={active => this.setState({ activeTab: active })} group={`tab-group-${this.props.position}`} />
            }
        return <Tab.TabContainer activeTab={0} class={['panel', this.props.position]} onChange={active => this.setState({ activeTab: active })} group={`tab-group-${this.props.position}`} />
    }
}