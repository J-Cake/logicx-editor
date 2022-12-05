import React from 'react';
import {ActionItem} from "../../core/ext/ViewportManager";
import {Icon} from "./icon";

export type MenuItem<Contents extends ActionItem | Menu> = {
    action: Contents,
    icon?: string,
    label: string
}

export type Menu = Array<MenuItem<any> | null>;

const isSubmenu = (x: ActionItem | Menu): x is Menu => Array.isArray(x);

export default function Menu(props: { children: Menu }) {
    return <table className='logicx-widget logicx-menu scroll-vertical'>
        <tbody>
        {props.children.map(i => i == null ? <tr>
                <hr/>
            </tr> :
            <tr className='logicx-menuitem'>
                {i.icon ? <td className='logicx-menuitem-icon'>{i.icon}</td> : null}
                <td>{i.label}</td>
                {/* If object is action, get keybinding, else display chevron*/}
                <td>{isSubmenu(i.action) ? <Icon icon={'ri-arrow-drop-right-line'}/> :
                    <span className='shortcut-preview'></span>}</td>
                {isSubmenu(i.action) ? <Menu>{i.action}</Menu> : null}
            </tr>)}
        </tbody>
    </table>
}
