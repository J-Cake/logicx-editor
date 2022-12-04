import React from 'react';

export default function ViewportContainer(props: {children: React.ReactNode | React.ReactNode[]}) {
    return <section className='logicx-viewport'>
        {props.children}
    </section>
}
