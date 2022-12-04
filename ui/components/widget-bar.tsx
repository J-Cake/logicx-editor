import React from 'react';

type Widget = [];

export default class WidgetBar extends React.Component<{ children: Widget[], position: 'top' | 'left' | 'right' }, {}> {
    state = {

    }
    render() {
        return <div className={`logicx-toolbar ${this.props.position ?? 'top'} logicx-widget-bar wrap-horizontal`}>

        </div>;
    }
}
