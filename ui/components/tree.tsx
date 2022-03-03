import React from 'react';

export function TreeNode(props: { heading: string, children: React.ReactNode, onSelect: () => void }) {
    return props.children;
}

type Props = { children: React.ReactElement<{ heading: string }>[] };
type State = { list: { heading: string, collapsed: boolean, body: React.ReactElement<{ heading: string }> }[] };
export default class Tree extends React.Component<Props, State> {

    state: State = { list: [] };

    constructor(props: Props) {
        super(props);

        this.state = { list: props.children.map(i => ({ heading: i.props.heading, collapsed: true, body: i })) };
    }

    render() {
        return <ul className='tree logicx-widget'>
            {this.state.list.map((i, a) => <li className={`tree-item logicx-widget ${i.collapsed ? 'collapsed' : 'expanded'}`} key={`tree-item${i.heading}`}>
                <label>
                    <input type="checkbox" checked={!this.state.list[a].collapsed} onChange={() => this.setState(prev => ({
                        list: [...prev.list.slice(0, a), { ...prev.list[a], collapsed: !prev.list[a].collapsed }, ...prev.list.slice(a + 1)]
                    }))} />
                    {i.heading}
                </label>

                <div>
                    {i.collapsed ? null : i.body}
                </div>
            </li>)}
        </ul>;
    }
}