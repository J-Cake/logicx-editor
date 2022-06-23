import React from 'react';

import type ChainComponent from '../circuit/chaincomponent';

export interface ComponentProps {
    component: ChainComponent<any, any>
}

export default function Component(props: ComponentProps): JSX.Element {
    return <div className='overview-component'>
        
    </div>;
}