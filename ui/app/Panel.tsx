import React from 'react';

import * as Tab from '../components/tab';

export default class Panel extends React.Component<{ children?: Tab.TabView[], activeTab: number, position: 'left' | 'right' }, { activeTab: number }> {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.props.activeTab
        };
    }

    render() {
        if (this.props.children?.length > 0)
            if (this.props.children[this.state.activeTab])
                return <Tab.TabContainer activeTab={this.state.activeTab} class={['panel', this.props.position]}>
                    {this.props.children ?? null}
                </Tab.TabContainer>;
            else {
                this.setState({ activeTab: 0 });

                return <Tab.TabContainer activeTab={0} class={['panel', this.props.position]} />
            }
        return <Tab.TabContainer activeTab={0} class={['panel', this.props.position]}/>
    }
}