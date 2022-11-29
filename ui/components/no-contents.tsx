import React from 'react';

// @ts-expect-error
import logo from '../../static/logo.svg';
import hints from '../../static/hints.json' assert {type: 'json'};

export default function NoContents(props: {}) {
    return <div className="no-contents centre ">
        <div className='logo-container'>
            {logo}
        </div>

        <div className='hints'>
            {hints[Math.floor(Math.random() * hints.length)]}
        </div>
    </div>;
}