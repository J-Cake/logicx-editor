import Document from "./document";

export default class BlankDocument extends Document {
    constructor() {
        super('', {
            circuitName: `Untitled Document`,
            content: {},
            components: [], // List of component tokens
            ownerEmail: '',
        });

        console.log('Whoa, doin\' something new?');
    }
}