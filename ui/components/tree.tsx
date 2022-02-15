import React from 'react';

export function TreeNode(props: { heading: string, children: React.ReactNode, onSelect: () => void }) {
    return props.children;
}

export default class Tree extends React.Component<{ children: React.ReactElement<{ heading: string }>[] }, { list: { heading: string, collapsed: boolean, body: React.ReactElement<{ heading: string }> }[] }> {

    state = { list: [] };

    constructor(props) {
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