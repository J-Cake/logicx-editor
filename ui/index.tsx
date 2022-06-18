import React from 'react';
import dom from 'react-dom/client';

import Interface from './app/Interface';

export default function app(root: HTMLElement) {
    dom.createRoot(root).render(<Interface documentId={window.location.pathname.split('/').pop()!} />);
}
