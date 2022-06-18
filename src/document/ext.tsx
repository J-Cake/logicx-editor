// extension('document', function (extension) {
//     extension.action.register('save', function() {
//         console.log('Saving');
//     });
// });

import React from 'react';

import { Extension } from "../../core/ext/Extension";
import { PanelHandle } from "../../core/ext/ViewportManager";
import { ApiDocument } from "../../core/api/resources";
import ToolButton from '../../ui/components/ToolButton';

import Document from './document';
import BlankDocument from './blankDocument';

export const name = 'document';

export interface Ctx {
    currentDocument: Document;
}

export class Documents extends React.Component<{ ctx: Extension<Ctx> }, { documents?: ApiDocument[] }> {
    static ctx: Extension<{}>;
    constructor(props: { ctx: Extension<Ctx> }) {
        super(props);
        this.state = {};
    }

    async loadDocuments() {
    }

    componentDidMount() {
        this.loadDocuments();
    }

    docs() {
        if (Array.isArray(this.state.documents))
            return <ul>
                {this.state.documents.map(doc => <li key={doc.circuitName.replaceAll(/\s+/, '-').toLowerCase()}>{doc.circuitName}</li>)}
            </ul>
        else
            return <div>Loading...</div>
    }

    render() {
        const newDoc = this.props.ctx.action.details('document.new')!;
        const Docs = this.docs.bind(this);

        return <div className='list-view logicx-widget'>
            <div className='list-view-header'>
                <ToolButton action={newDoc} onClick={() => newDoc.invoke()} />
            </div>
            <Docs />
        </div>
    }

    static getPanel(extension: Extension<Ctx>): void {
        extension.action.register('save', function () {
            console.log('saving');
        });

        extension.api().expose('on-request-document-change', function (handler: (document: Document) => void) {
            extension.storage().on('document-change', prev => handler(prev.currentDocument));
        });

        extension.api().expose('get-open-document', function (): Document {
            return extension.storage().get().currentDocument;
        });

        extension.action.register('new', function () {
            const doc = new BlankDocument();

            extension.storage().dispatch('document-change', {
                currentDocument: doc
            });
        });

        extension.ui.panel({ label: 'Documents', icon: 'file', panel: 'left' }, (panel: PanelHandle) => React.createElement(Documents, {
            ctx: extension
        }));
    }
}

export default Documents.getPanel.bind(Documents);