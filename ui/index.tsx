import React from 'react';
import dom from 'react-dom';

import Interface from './app/Interface';

export default function app(root: HTMLElement) {
    const App = (props: {}) => <Interface documentId={window.location.pathname.split('/').pop()} />;

    dom.render(<App />, root);
}
