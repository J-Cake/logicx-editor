import React from 'react';
import _ from 'lodash';

import Collapsible from '../../ui/components/collapsible';

import type Stateless from '../circuit/stateless';
import type Stateful from '../circuit/stateful';
import type Dynamic from '../circuit/dynamic';
import type Document from '../document/document';

import Component from './Component';
import { extension } from './ext';

export interface ComponentTypeProps {

}

export type Nullable<T> = T | undefined | null;

const comp = {
    stateless: null as any as typeof Stateless,
    stateful: null as any as typeof Stateful,
    dynamic: null as any as typeof Dynamic,
}

export function getComponents(): Nullable<{ stateless: Stateless<any, any>[], stateful: Stateful<any, any>[], dynamic: Dynamic<any, any>[] }> {

    const components = (extension.api().getNamespace('circuit').getSymbol('get-current-document')() as Nullable<Document>)?.circuit;

    const Stateless = comp.stateless ??= extension.api().getNamespace('circuit').getSymbol('Stateless')!;
    const Stateful = comp.stateful ??= extension.api().getNamespace('circuit').getSymbol('Stateful')!;
    const Dynamic = comp.dynamic ??= extension.api().getNamespace('circuit').getSymbol('Dynamic')!;

    if (!components) return;

    return _.groupBy(components, i => i instanceof Stateless ? 'stateless' : (i instanceof Stateful  ? 'stateful' : (i instanceof Dynamic ? 'dynamic' : 'unknown'))) as any;
}

export default function ComponentType(props: ComponentTypeProps) {
    const types = getComponents();

    console.log(types);

    // TODO: attach to OnRequestDocumentChange event

    if (types)
        return <div>
            <Collapsible heading="Stateless" expanded={true}>
                {types.stateless?.map((i, a) => <Component component={i} key={`stateless-${a}`} />)}
            </Collapsible>
            <Collapsible heading="Stateful" expanded={true}>
                Hi World
            </Collapsible>
            <Collapsible heading="Dynamic" expanded={true}>
                Hello Again
            </Collapsible>
        </div>;
    else
        return <div>
            Open a document to inspect its components
        </div>
}
