import React from 'react';
import dom from 'react-dom';

import Interface from './app/Interface';

const App = (props: {}) => <Interface documentId={window.location.pathname.split('/').pop()}/>;

dom.render(<App/>, document.querySelector("section#root"));
