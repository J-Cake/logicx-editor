import React from 'react';
import _ from 'lodash';

export interface ComboboxProps<T extends string> {
    children: T[],
    active?: T,
    onChange?: (key: T) => void
}

export interface ComboboxState<T extends string> {
    active: T;
    focused: T | null;
    refs: Record<T, React.RefObject<HTMLSpanElement>>,
    widget: React.RefObject<HTMLDivElement>
}

export default class Combobox<T extends string> extends React.Component<ComboboxProps<T>, ComboboxState<T>> {
    constructor(props: ComboboxProps<T>) {
        super(props);

        this.state = {
            active: props.children[0] as T,
            focused: props.children[0] as T,
            refs: _.chain(props.children)
                .map(i => [i, React.createRef<HTMLSpanElement>()])
                .fromPairs()
                .value() as any,
            // refs: _.mapValues(props.children, i => React.createRef()),
            widget: React.createRef()
        };
    }


    private changeFocus(e: React.KeyboardEvent<HTMLDivElement>) {
        const index = this.state.focused ? this.props.children.indexOf(this.state.focused) : -1;

        e.preventDefault();

        if (!['ArrowUp', 'ArrowDown'].includes(e.key))
            if (['Enter', ' '].includes(e.key)) {
                this.state.refs[this.props.children[0]].current?.focus();
                this.setState({
                    focused: this.props.children[0]
                });
                return;
            } else
                return;

        if (index <= -1) {
            this.state.refs[this.props.children[0]].current?.focus();
            this.setState({
                focused: this.props.children[0]
            });
            return;
        }

        const newFocus = this.props.children[index + (e.key === 'ArrowUp' ? -1 : 1)];

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
        return <div className="logicx-control dropdown-option-list"
            tabIndex={0}
            onKeyUp={e => this.changeFocus(e)}
            onClick={() => this.state.refs[this.state.active].current?.focus()}
            ref={this.state.widget}
            onBlur={() => this.setState({ focused: null })}>

            <label className="dropdown-active">{this.state.active}</label>
            <div className="dropdown-expanded-options">
                {this.props.children.map(key => <span
                    ref={this.state.refs[key as T]}
                    className="dropdown-option"
                    tabIndex={-1}
                    key={key}
                    onKeyUp={e => ['Enter', ' '].includes(e.key) && this.setKey(key as T)}
                    onClick={() => this.setKey(key as T)}>{key}</span>)}

            </div>
        </div>;
    }
}