import React from "react";
import _ from 'lodash';

export interface DropdownProps<T extends string = string> {
    label: string;
    children: Record<T, React.ReactNode[]>;
    onChange?: (key: T) => void
}

export interface DropdownState<T extends string> {
    active: T;
    focused: T | null;
    refs: Record<T, React.RefObject<HTMLSpanElement>>,
    widget: React.RefObject<HTMLDivElement>
}

const wrap = (x: number, max: number) => (x + max) % max;

export default class Dropdown<T extends string> extends React.Component<DropdownProps<T>, DropdownState<T>> {
    constructor(props: DropdownProps<T>) {
        super(props);

        this.state = {
            active: Object.keys(props.children)[0] as T,
            focused: Object.keys(props.children)[0] as T,
            refs: _.mapValues(props.children, i => React.createRef()),
            widget: React.createRef()
        };
    }

    private changeFocus(e: React.KeyboardEvent<HTMLDivElement>) {
        const options = Object.keys(this.props.children) as T[];
        const index = this.state.focused ? options.indexOf(this.state.focused) : -1;

        e.preventDefault();

        if (!['ArrowUp', 'ArrowDown'].includes(e.key))
            if (['Enter', ' '].includes(e.key)) {
                this.state.refs[options[0]].current?.focus();
                this.setState({
                    focused: options[0]
                });
                return;
            } else
                return;

        if (index <= -1) {
            this.state.refs[options[0]].current?.focus();
            this.setState({
                focused: options[0]
            });
            return;
        }

        const newFocus = options[index + (e.key === 'ArrowUp' ? -1 : 1)];

        if (newFocus && this.state.refs[newFocus]?.current) {
            this.state.refs[newFocus]?.current?.focus();
            this.setState({
                focused: newFocus
            });
        } else
            this.state.refs[this.state.focused!].current?.focus();
    }

    private setKey(key: T) {
        this.setState({ active: key as T, focused: null });
        this.state.widget.current?.focus(); // doesn't work
        this.props.onChange?.(key);
    }

    render() {
        return <div className="dropdown-container logicx-widget">
            <div className="dropdown-header">
                <label>{this.props.label}</label>

                <div className="dropdown-option-list"
                    tabIndex={0}
                    onKeyUp={e => this.changeFocus(e)}
                    onClick={() => this.state.refs[this.state.active].current?.focus()}
                    ref={this.state.widget}
                    onBlur={() => this.setState({ focused: null })}>

                    <label className="dropdown-active">{this.state.active}</label>
                    <div className="dropdown-expanded-options">
                        {Object.keys(this.props.children).map(key => <span
                            ref={this.state.refs[key as T]}
                            className="dropdown-option"
                            tabIndex={-1}
                            key={key}
                            onKeyUp={e => ['Enter', ' '].includes(e.key) && this.setKey(key as T)}
                            onClick={() => this.setKey(key as T)}>{key}</span>)}

                    </div>
                </div>
            </div>
            <div className="dropdown-viewbox">{this.props.children[this.state.active]}</div>
        </div>
    }
}