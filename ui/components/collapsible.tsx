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
            <div className="logicx-widget collapsible-header" tabIndex={0}>
                <input type="checkbox" checked={this.state.expanded} />
                <label>{this.props.heading}</label>
            </div>
            <div className="collapsible-body">{this.props.children}</div>
        </div>
    }
}