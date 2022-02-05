import React from "react";

export default class Interface extends React.Component<{documentId: string}> {

    constructor(props) {
        super(props);

        const extensions = JSON.parse(window.localStorage.getItem("extensions"));
    }

    render() {
        return <section id="interface">
            
        </section>;
    }
}