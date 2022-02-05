import React from 'react';
import ActionManager from '../../app/ext/ActionManager';

export type Action = {
    name: string,
    icon?: string,
    shortcut?: string,
    tooltip?: string,
};

export default class ToolBar extends React.Component<{ actions: Action[], position: 'top' | 'left' | 'right' }> {
    render() {
        return <div className={`toolbar ${this.props.position}`}>
            ToolBar
        </div>;
    }
}