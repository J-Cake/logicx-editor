// extension('document', function (extension) {
//     extension.action.register('save', function() {
//         console.log('Saving');
//     });
// });

import React from 'react';

import {Extension} from "../../core/ext/Extension";
import {PanelHandle} from "../../core/ext/ViewportManager";
import {ApiDocument} from "../../core/api/resources";

export const name = 'document';

export class Documents extends React.Component<{}, { documents?: ApiDocument[] }> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    async loadDocuments() {
    }

    componentDidMount() {
        this.loadDocuments();
    }

    render() {
        if (Array.isArray(this.state.documents))
            return <ul>
                {this.state.documents.map(doc => <li key={doc.circuitName.replaceAll(/\s+/, '-').toLowerCase()}>{doc.circuitName}</li>)}
            </ul>
        else
            return <div>Loading...</div>
    }
}

export default function(extension: Extension<{}>) {
    extension.action.register('save', function() {
        console.log('saving');
    });
    
    extension.resource()

    extension.ui.panel({ label: 'Documents', icon: 'file', panel: 'left' }, (panel: PanelHandle) => <Documents/>);
}