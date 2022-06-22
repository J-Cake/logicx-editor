import React from 'react';

import { Extension } from "../../core/ext/Extension";
import { ApiDocument } from "../../core/api/resources";
import ToolButton from '../../ui/components/toolbtn';

import { Ctx } from './ext';

export default class Panel extends React.Component<{ ctx: Extension<Ctx> }, { documents?: ApiDocument[] }> {
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

}