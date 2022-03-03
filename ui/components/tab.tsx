import React from "react";

export class TabView extends React.Component<{ title: string }> {
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
        return <div className={`tab-container ${this.props.class?.join(' ') ?? ''}`}>
            <div className="tab-header">
                {this.props.children?.map((i, a) => <div className="tab logicx-widget" key={`tab-${i.props.title}`}>
                    <label>
                        <input type="radio" name={this.props.group} onChange={() => this.props.onChange(a)} checked={a === this.props.activeTab}/>
                        {i.props.title}
                    </label>
                </div>)}
            </div>
            <div className="tab-body">
                {this.props.children?.[this.props.activeTab]}
            </div>
        </div>;
    }
}