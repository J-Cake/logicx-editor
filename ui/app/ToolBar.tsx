import React from 'react';

import { StateMgr } from '../../app';
import { ActionItem } from '../../app/ext/ViewportManager';

export default class ToolBar extends React.Component<{ actions: ActionItem[], position: 'top' | 'left' | 'right' }> {
    render() {
        return <div className={`toolbar ${this.props.position}`}>
            {this.props.actions?.map(action => <button
                key={`toolbar-action-${action.name}`}
                className="toolbar-button logicx-widget"
                onClick={() => StateMgr.get().actions.invokeAction(action.name)}
                disabled={!action.enabled}>
                <span className="logicx-icon">{action.icon}</span>
                {action.friendly ?? action.name.split('.').pop()}
            </button>)}
        </div>;
    }
}