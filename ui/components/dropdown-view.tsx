import React from "react";
import _ from 'lodash';
import Combobox from "./combobox";

export interface DropdownProps<T extends string = string> {
    label: string;
    children: Record<T, React.ReactNode[]>;
    // onChange?: (key: T) => void
}

export interface DropdownState<T extends string> {
    active: T;
}

export default class Dropdown<T extends string> extends React.Component<DropdownProps<T>, DropdownState<T>> {
    constructor(props: DropdownProps<T>) {
        super(props);

        this.state = {
            active: Object.keys(props.children)[0] as T,
        };
    }

    render() {
        return <div className="dropdown-container logicx-widget">
            <div className="dropdown-header">
                <label>{this.props.label}</label>

                <Combobox onChange={active => this.setState({ active })}>{this.props.children}</Combobox>
            </div>
            <div className="dropdown-viewbox">{this.props.children[this.state.active]}</div>
        </div>
    }
}