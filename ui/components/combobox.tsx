import React from 'react';
import _ from 'lodash';
import MenuView from "#components/menu";

export interface ComboboxProps<T extends string> {
    children: T[],
    active?: T,
    onChange?: (key: T) => void
}

export interface ComboboxState<T extends string> {
    active: T;
    focused: T | null;
    refs: Record<T, React.RefObject<HTMLSpanElement>>,
    widget: React.RefObject<HTMLDivElement>,
    isOpen: boolean
}

export default class Combobox<T extends string> extends React.Component<ComboboxProps<T>, ComboboxState<T>> {
    constructor(props: ComboboxProps<T>) {
        super(props);

        this.state = {
            active: props.active ?? props.children[0] as T,
            focused: props.children[0] as T,
            refs: _.chain(props.children)
                .map(i => [i, React.createRef<HTMLSpanElement>()])
                .fromPairs()
                .value() as any,
            // refs: _.mapValues(props.children, i => React.createRef()),
            widget: React.createRef(),
            isOpen: false
        };
    }

    select(i: T) {
        this.setState({active: i, isOpen: false});
        if (this.props.onChange)
            this.props.onChange(i);
    }

    render() {
        return <div className="logicx-control dropdown-option-list"
                    tabIndex={0}
                    ref={this.state.widget}
                    onFocus={() => this.setState({isOpen: true})}>

            <label className="dropdown-active">{this.state.active}</label>
            {this.state.isOpen ? <MenuView children={this.props.children.map(i => ({
                label: i,
                action: () => this.select(i)
            }))} active={this.props.children.indexOf(this.state.active)} pos={{
                x: this.state.widget.current?.getBoundingClientRect().x ?? 0,
                y: this.state.widget.current?.getBoundingClientRect().bottom ?? 0
            }}/> : null}
        </div>;
    }
}