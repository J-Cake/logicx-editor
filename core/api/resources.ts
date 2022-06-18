export type wires = {
    [dest: number]: [{
        coords: [number, number][],
        inputIndex: number,
        outputIndex: number
    }]
};

export interface GenericComponent {
    token: string,
    direction: 0 | 1 | 2 | 3,
    flip: boolean,
    outputs: {
        [terminal: string]: [number, string][] // [terminal: string]: [destId: number, destTerminal: string][]
    }
    label: string,
    position: [number, number],
    wires: wires
}

// This type indicates a JSON-compatible type which the API responds with.
export interface ApiDocument {
    circuitName: string,
    content: { [id: number]: GenericComponent },
    components: string[], // List of component tokens
    ownerEmail: string,
}