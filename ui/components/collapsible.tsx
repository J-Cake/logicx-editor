import React from 'react';

export interface CollapsibleProps {
    heading: string;
    expanded?: boolean;
    children: React.ReactNode;
}

export interface CollapsibleState {
    expanded: boolean
}

export default class Collapsible extends React.Component<CollapsibleProps, CollapsibleState> {

    constructor(props: CollapsibleProps) {
        super(props);

        this.state = {
            expanded: props.expanded ?? false
        };
    }

    render() {
        return <div className="logicx-widget collapsible-container">
            <div className={`logicx-widget collapsible-header ${this.state.expanded ? 'expanded' : ''}`}
                tabIndex={0}
                onKeyUp={e => ['Enter', ' '].includes(e.key) && this.setState({ expanded: !this.state.expanded })}
                onClick={() => this.setState({ expanded: !this.state.expanded })}>
                {this.props.heading}
            </div>
            <div className="collapsible-body">{this.state.expanded ? this.props.children : null}</div>
        </div>
    }
}