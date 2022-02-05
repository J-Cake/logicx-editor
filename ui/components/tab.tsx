import React from "react";

export class TabView extends React.Component<{ title: string }> {
    render() {
        return <div className="tab-view logicx-widget">
            {this.props.children}
        </div>;
    }
}

export class TabContainer extends React.Component<{ activeTab: number, children?: TabView[], class: string[] }, { activeTab: number }> {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.props.activeTab
        };
    }

    render() {
        return <div className={`tab-container ${this.props.class.join(' ')}`}>
            TabView
            <div className="tab-header">
                {this.props.children?.map(i => <div className="tab logicx-widget">{i.props.title}</div>)}
            </div>
            <div className="tab-body">
                {this.props.children?.[this.state.activeTab]}
            </div>
        </div>;
    }
}