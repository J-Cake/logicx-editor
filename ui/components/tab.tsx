import React from "react";

export class TabView extends React.Component<{ title: string, children: React.ReactChild[] | React.ReactChild }> {
    render() {
        return <div className="tab-view logicx-widget">
            {this.props.children}
        </div>;
    }
}

type Props = { activeTab: number, children?: React.ReactElement<{ title: string }>[], class?: string[], onChange: (index: number) => void, group: string };
export class TabContainer extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return <div className={`tab-container logicx-widget ${this.props.class?.join(' ') ?? ''}`}>
            <div className="tab-header">
                {this.props.children?.map((i, a) => <label className={`tab logicx-control ${a == this.props.activeTab ? "active" : ""}`} key={`tab-${i.props.title}`}>
                    <input type="radio" name={this.props.group} onChange={() => this.props.onChange(a)} checked={a === this.props.activeTab} />
                    {i.props.title}
                </label>)}
            </div>
            <div className="tab-body">
                {this.props.children?.[this.props.activeTab]}
            </div>
        </div>;
    }
}