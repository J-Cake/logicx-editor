import React from "react";
import _ from 'lodash';

export class TabView extends React.Component<{ title: string, children: React.ReactNode }> {
    render() {
        return <div className="tab-view logicx-widget">
            {this.props.children}
        </div>;
    }
}

export interface TabContainerProps<T extends string> {
    children: Record<T, React.ReactElement<{ title: string, children: React.ReactNode }>>,
    className?: string,
    active?: T
}
export interface TabContainerState<T extends string> {
    active: T,
    refs: Record<T, React.RefObject<HTMLDivElement>>
}

export class TabContainer<T extends string> extends React.Component<TabContainerProps<T>, TabContainerState<T>> {
    constructor(props: TabContainerProps<T>) {
        super(props);

        this.state = {
            active: Object.keys(props.children)[0] as T,
            refs: _.mapValues(props.children, i => React.createRef())
        }
    }

    private changeFocus(e: React.KeyboardEvent) {
        if (!['ArrowLeft', 'ArrowRight'].includes(e.key))
            return;

        const keys: T[] = Object.keys(this.props.children) as T[];
        const current = keys.indexOf(this.state.active);

        console.log(e.key);

        const selected: T = keys[current + (e.key == 'ArrowLeft' ? -1 : 1)];
        console.log(selected);
        if (selected) {
            this.setState({ active: selected });
            this.state.refs[selected]?.current?.focus();
        }
    }

    render() {
        return <div className={`tab-container logicx-widget ${this.props.className ?? ''}`}>
            <div className="tab-header" tabIndex={0} onKeyUp={e => this.changeFocus(e)}>
                {_.chain(this.state.refs)
                    .entries()
                    .map(([name, ref]) => <div
                        tabIndex={-1}
                        key={`tab-${name}`}
                        ref={ref}
                        onClick={() => this.setState({ active: name as T })}
                        className={`tab logicx-control ${name == this.props.active ? 'active' : ''}`}>
                        {name}
                    </div>)
                    .value()}
            </div>
            <div className="tab-body">
                {this.props.children[this.state.active]}
            </div>
        </div >;
    }
}