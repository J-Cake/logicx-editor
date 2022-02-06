import React from 'react';

import { StateMgr } from '../../app';

export type Action = {
    name: string,
    icon?: string,
    shortcut?: string,
    tooltip?: string,
    disabled: boolean
};

export default class ToolBar extends React.Component<{ actions: Action[], position: 'top' | 'left' | 'right' }> {
    render() {
        return <div className={`toolbar ${this.props.position}`}>
            {this.props.actions.map(action => <button
                key={`toolbar-action-${action.name}`}
                className="toolbar-button logicx-widget"
                onClick={() => StateMgr.get().actions.invokeAction(action.name)}
                disabled={action.disabled}>
                <span className="logicx-icon">{action.icon}</span>
                {action.name}
            </button>)}
        </div>;
    }
}