import React from 'react';
import _ from 'lodash';

import Tree, * as tree from '../../ui/components/tree';

extension('find-action', function (extension) {

    const find = extension.panel({ label: 'find', icon: 'search', panel: 'right' }, function (panel) {
        const list = namespaces => <Tree>
            {_.map(namespaces, (namespace, name) => <tree.TreeNode key={name} heading={name}>
                {list(namespace.namespaces)}
                {_.map(namespace.actions, action => <button onClick={() => extension.invoke(action.name)}>{action.friendly ?? action.name.split('.').pop()}</button>)}
            </tree.TreeNode>)}
        </Tree>;

        return list(extension.actions().listAll());
    });

    extension.actions().register('find', function () {
        find.focus();
    }, 'Run Action');

    extension.actions().register('define-shortcut', function() {
        console.log('Defining shortcut');
    }, 'Set Keyboard Shortcut');

    const settings = extension.actions().fork('settings');

    settings.register('find', function () { console.log('settings.find') });
    settings.register('close', function () { console.log('settings.close') });

    extension.panel({ label: 'cover', icon: 'door', panel: 'right' }, function (panel) {
        return <div>Hi</div>
    });
});