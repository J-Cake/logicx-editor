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
                
            </Collapsible>
            <Collapsible heading="Stateful">
                
            </Collapsible>
            <Collapsible heading="Dynamic">
                
            </Collapsible>
        </div>
    }
}