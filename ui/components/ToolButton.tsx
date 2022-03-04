import React from 'react';

import type { ActionItem } from "../../core/ext/ViewportManager";

export default function ToolButton(props: { action: ActionItem, onClick: () => void }) {
    return <button
        key={`toolbar-action-${props.action.name}`}
        className="toolbar-button logicx-widget"
        onClick={() => props.onClick()}
        disabled={!props.action.enabled}>
        <span className="logicx-icon">{props.action.icon}</span>
        {props.action.friendly ?? props.action.name.split('.').pop()}
    </button>;
}