import React from 'react';

import Dropdown from '../../ui/components/dropdown';
import ComponentType from './ComponentType';
import Flat from './Flat';
import Tree from './Tree';

export interface OverviewProps {

}

export interface OverviewState {
    view: 'Component Type' | 'Flat' | 'Tree';
}

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps) {
        super(props);
    }

    render() {
        return <Dropdown<OverviewState['view']> label="View">{{
            'Component Type': [<ComponentType />],
            'Flat': [<Flat />],
            'Tree': [<Tree />]
        }}</Dropdown>
    }
}