import React from 'react';

import { ActionItem } from '../../core/ext/ViewportManager';
import ToolBtn from './private/toolbtn';

export default class ToolBar extends React.Component<{ children?: ActionItem[], position: 'top' | 'left' | 'right' }> {
    render() {
        return <div className={`logicx-toolbar ${this.props.position}`}>
            {this.props.children?.map(action => <ToolBtn action={action} key={Math.random()} />)}
        </div>;
    }
}
