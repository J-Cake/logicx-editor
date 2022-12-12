export type Wires = {
    [dest: number]: { // The index of the component in the doc
        coords: [number, number][], // A list of vertices (excluding start and end points)
        inputIndex: number, // the index of the terminal on the connecting component
        outputIndex: number // the index of the terminal on the current component
    }[]
};

export interface GenericComponent {
    token: string,
    direction: 0 | 1 | 2 | 3,
    flip: boolean,
    label: string,
    position: [number, number],
    wires: Wires
}

export interface ApiComponentDefinition<Inputs extends string[], Outputs extends string[]> {
    type: string,
    name: string,
    token: string,
    inputs: Inputs,
    outputs: Outputs,
}

export interface ApiStatelessComponentDefinition<Inputs extends string[], Outputs extends string[]> extends ApiComponentDefinition<Inputs, Outputs> {
    type: 'Stateless',
    truthTable: [input: { [input in Inputs[number]]: boolean }, output: { [output in Outputs[number]]: boolean }][]
}

export interface ApiStatefulComponentDefinition<Inputs extends string[], Outputs extends string[]> extends ApiComponentDefinition<Inputs, Outputs> {
    type: 'Stateful',
    children: ApiDocument['components'],
}

export interface ApiDynamicComponentDefinition<Inputs extends string[], Outputs extends string[]> extends ApiComponentDefinition<Inputs, Outputs> {
    type: 'Dynamic',

    origin: string,
}

// This type indicates a JSON-compatible type which the API responds with.
export interface ApiDocument {
    circuitName: string,
    content: GenericComponent[],
    components: { [token in string]: string | ApiComponentDefinition<any, any> },
    ownerEmail: string,
}
