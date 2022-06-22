import React from 'react';

export type StatusItemProps = { children: () => (JSX.Element | null), label: string, icon?: string };
export default function StatusItem(props: StatusItemProps): JSX.Element {
    const [menu, setMenu] = React.useState<JSX.Element | null>(null);

    return <div className="status-item" tabIndex={0} onKeyUp={e => ['Enter', ' '].includes(e.key) ? setMenu(menu ? null : props.children()) : null} onClick={() => setMenu(menu ? null : props.children())}>
        
        {props.icon ? <span className='icon'>{props.icon}</span> : null}
        <label>{props.label}</label>

        {menu ?? null}
    </div>
}