import Collapsible from '../../ui/components/collapsible';
import React from 'react';

export interface ComponentTypeProps {

}

export interface ComponentTypeState {
    
}

export default class ComponentType extends React.Component<ComponentTypeProps, ComponentTypeState> {
    render() {
        return <div>
            <Collapsible heading="Stateless">
                Hello World
            </Collapsible>
            <Collapsible heading="Stateful">
                Hi World
            </Collapsible>
            <Collapsible heading="Dynamic">
                Hello Again
            </Collapsible>
        </div>
    }
}