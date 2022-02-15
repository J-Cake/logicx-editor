import React from 'react';
import _ from 'lodash';

import Tree, * as tree from '../../ui/components/tree';

export const name = 'find-action';

export default function (extension) {

    class Actions extends React.Component {
        state = { search: '' };

        list(namespaces, name = 'top') {
            return <Tree key={`action-search-tree-${name}`}>
                {_.map(namespaces, (namespace, ns_name) => <tree.TreeNode key={`${name}-${ns_name}-${Math.random()}`} heading={ns_name}>
                    {this.list(namespace.namespaces, ns_name)}
                    {_.map(namespace.actions, action => {
                        if (action.name.toLowerCase().trim().includes(this.state.search.toLowerCase().trim()) || this.state.search.trim().length === 0)
                            return <button onClick={() => extension.action.invoke(action.name)}>{action.friendly ?? action.name.split('.').pop()}</button>;
                        return null;
                    })}
                </tree.TreeNode>)}
            </Tree>;
        }

        setSearch(target) {
            this.setState({ search: target.target.value });
        }

        render() {
            return <div>
                <input type="text" placeholder="filter" focused="true" value={this.state.search} onChange={target => this.setSearch(target)} />

                {this.list(extension.action.listAll())}
            </div>;
        }
    }

    const find = extension.ui.panel({ label: 'find', icon: 'search', panel: 'right' }, () => <Actions />);

    extension.action.register('find', function () {
        find.focus();
    }, 'Run Action');

    extension.action.register('define-shortcut', function () { });

    const settings = extension.action.fork('settings');

    settings.register('find', function () { });
    settings.register('close', function () { });

    extension.ui.panel({ label: 'cover', icon: 'door', panel: 'right' }, function (panel) {
        return <div>Hi</div>
    });
}