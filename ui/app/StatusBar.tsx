import React from 'react';

import { StatusItemProps } from "./private/status";

export interface StatusBarProps {
    children: {
        left: React.ReactElement<StatusItemProps>[],
        right: React.ReactElement<StatusItemProps>[]
    }
}

export default class StatusBar extends React.Component<StatusBarProps> {
    render() {
        return <div id="statusbar">
            {this.props.children.left.map((i, a) => <div key={a} className="statusbar-item">{i}</div>)}
            <span className='logicx-spacer' />
            {this.props.children.left.map((i, a) => <div key={a} className="statusbar-item">{i}</div>)}
        </div>;
    }
}
