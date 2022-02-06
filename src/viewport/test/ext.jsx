import React from 'react';

/// <reference path="Extension.ts" />
extension("test", function (extension) {

    class Eatmyass extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                num: 1
            };
        }
        render() {
            return <button onClick={() => this.setState(prev => ({ num: prev.num + 1 }))}> hello {this.state.num} </button>;
        }
    }
    
    extension.viewport(() => <Eatmyass/>);

});