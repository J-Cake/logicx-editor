import $ from 'jquery';
import React from 'react';

import {ActionItem} from "#core/ext/ViewportManager";
import {Icon} from "./icon";
import StateManager from "#core/stateManager";

export type MenuItem<Contents extends string | ActionItem | ((i: MenuItem<Contents>) => void) | Menu> = {
    action: Contents,
    icon?: string,
    label: string
}

export type Menu = Array<MenuItem<any> | null>;

const isSubmenu = (x: string | ActionItem | ((i: MenuItem<typeof x>) => void) | Menu): x is Menu => Array.isArray(x);

const wrap = (x: number, min: number, max: number) => (max - (min - x)) % max;

type MenuViewProps = { children: Menu | MenuItem<any>, pos?: { x: number, y: number }, active?: number };
type MenuViewState = { active: number, actions: Menu, refs: React.RefObject<HTMLDivElement>[], menu: React.RefObject<HTMLDivElement>, pos: {x: number, y: number} };

const pos = new StateManager({x: 0, y: 0});

$(document).on('mousemove', e => pos.setState({
    x: e.clientX,
    y: e.clientY
}))

export default class MenuView extends React.Component<MenuViewProps, MenuViewState> {
    constructor(props: MenuViewProps) {
        super(props);

        this.state = {
            active: props.active ?? 0,
            actions: [...(Array.isArray(props.children) ? props.children : [props.children])],
            refs: [...(Array.isArray(props.children) ? props.children : [props.children])].map(i => React.createRef<HTMLDivElement>()),
            menu: React.createRef(),
            pos: {
                x: Math.max(Math.min(this.props.pos?.x ?? pos.get().x, window.outerWidth - (this.state?.menu?.current?.clientWidth ?? 0)), 0),
                y: Math.max(Math.min(this.props.pos?.y ?? pos.get().y, window.outerHeight - (this.state?.menu?.current?.clientHeight ?? 0)), 0),
            }
        };
    }

    dispatch(dir: number) {
        this.setState(prev => ({
            active: wrap(prev.active + dir, 0, this.state.actions.length)
        }));
    }

    private focusActive() {
        this.state.refs[this.state.active].current?.focus();
    }

    componentDidUpdate(prevProps: Readonly<MenuViewProps>, prevState: Readonly<MenuViewState>, snapshot?: any) {
        this.focusActive();
    }

    componentDidMount() {
        requestAnimationFrame(() => this.focusActive());
    }

    select(item: MenuItem<any>) {
       if (typeof item.action() == 'function')
           item.action(item);
    }

    render() {
        return <div className="logicx-widget logicx-menu scroll-vertical"
                    ref={this.state.menu}
                    style={{
                        left: `${this.state.pos.x}px`,
                        top: `${this.state.pos.y}px`,
                    }}
                    onKeyDown={e => e.key == 'ArrowDown' ? this.dispatch(1) : e.key == 'Enter' ? this.select(this.state.actions[this.state.active]!) : null}
                    onKeyUp={e => e.key == 'ArrowUp' ? this.dispatch(-1) : null}>

            {this.state.actions
                .map((i, a) => i ? <div key={a} ref={this.state.refs[a]} className='logicx-menuitem' tabIndex={-1} {...isSubmenu(i.action) ? ({}) : ({
                    onClick: () => this.select(i)
                })}>
                    {i.icon ? <Icon icon={i?.icon}/> : <span/>}
                    <div>{i.label}</div>
                    <div></div>
                </div> : <hr key={a}/>)
                .filter(i => i)}
        </div>;
    }
}