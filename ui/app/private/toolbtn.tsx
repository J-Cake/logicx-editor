import React from 'react';

import { StateMgr } from "../../../core";
import { ActionItem } from "../../../core/ext/ViewportManager";

export default function ToolBtn(props: { action: ActionItem | string }) {
    try {
        const action = typeof props.action === 'string' ? StateMgr.get().actions.details(props.action) : props.action;

        if (!action)
            return null;

        return <button
            key={`toolbar-action-${action.name}`}
            className="toolbar-button logicx-widget"
            onClick={() => StateMgr.get().actions.invokeAction(action.name)}
            disabled={!action.enabled}>
            <span className="logicx-icon">{action.icon}</span>
            {action.friendly ?? action.name.split('.').pop()}
        </button>;
    } catch (err) {
        return null;
    }
}