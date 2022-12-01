export type wires = {
    [dest: number]: {
        coords: [number, number][],
        inputIndex: number,
        outputIndex: number
    }[]
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

export interface ApiComponentDefinition {
    type: string,
    name: string,
    token: string,
    inputs: string[],
    outputs: string[],
}

export interface ApiStatelessComponentDefinition extends ApiComponentDefinition {
    type: 'Stateless',
    truthTable: [input: { [input: string]: boolean }, output: { [output: string]: boolean }][]
}

export interface ApiStatefulComponentDefinition extends ApiComponentDefinition {
    type: 'Stateful',
    children: ApiDocument['components'],
}

export interface ApiDynamicComponentDefinition extends ApiComponentDefinition {
    type: 'Dynamic',

    origin: string,
}

// This type indicates a JSON-compatible type which the API responds with.
export interface ApiDocument {
    circuitName: string,
    content: GenericComponent[],
    components: { [token in string]: string | ApiComponentDefinition },
    ownerEmail: string,
}