import React from 'react';

export function TreeNode(props: { heading: string, children: React.ReactNode, onSelect: () => void }) {
    return props.children;
}

type Props = { children: React.ReactElement<{ heading: string }>[] };
type State = { list: { heading: string, collapsed: boolean, body: React.ReactElement<{ heading: string }>, ref: React.RefObject<HTMLDivElement> }[], active: number };
export default class Tree extends React.Component<Props, State> {

    state: State = { list: [], active: 0 };

    constructor(props: Props) {
        super(props);

        this.state = {
            list: props.children.map(i => ({
                heading: i.props.heading,
                collapsed: true,
                body: i,
                ref: React.createRef()
            })),
            active: -1
        };
    }

    private onChange(a: number) {
        this.setState(prev => ({
            list: [...prev.list.slice(0, a), { ...prev.list[a], collapsed: !prev.list[a].collapsed }, ...prev.list.slice(a + 1)]
        }))
    }

    // private changeFocus(key: string) {
    //     if (!['ArrowUp', 'ArrowDown'].includes(key))
    //         return;

    //     if (this.state.active <= -1) {
    //         this.state.list[0].ref.current?.focus();
    //         this.setState({active: 0});
    //     }

    //     const index = this.state.active + (key == 'ArrowUp' ? -1 : 1);
    //     if (this.state.list[index]) {
    //         this.state.list[index].ref.current?.focus();
    //         this.setState({ active: index });
    //     }
    // }

    render() {
        return <ul className='tree logicx-widget'> {/* tabIndex={0} onKeyUp={e => this.changeFocus(e.key)} onBlur={() => this.setState({ active: -1 })} */}
             {this.state.list.map((i, a) => <li className={`tree-item logicx-widget ${i.collapsed ? 'collapsed' : 'expanded'}`} key={`tree-item${i.heading}`}>
                <div tabIndex={0} ref={this.state.list[a].ref!} onClick={() => this.onChange(a)} onKeyUp={e => ['Enter', ' '].includes(e.key) && this.onChange(a)}>{i.heading}</div>

                <div>
                    {i.collapsed ? null : i.body}
                </div>
            </li>)}
        </ul>;
    }
}