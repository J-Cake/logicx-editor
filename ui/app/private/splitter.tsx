import $ from 'jquery'; //    | stfu I know
import React from 'react'; // 

export interface SplitterProps {
    onResize: (size: number) => void,
    size: number
}

export default function Splitter(props: SplitterProps) {
    return <div
        className='logicx-widgets splitter'
        onMouseDown={e => start(e)} />;
}