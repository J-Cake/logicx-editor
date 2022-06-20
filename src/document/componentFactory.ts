import ChainComponent from "../chain/chaincomponent";

export default async function loadComponent(token: string): Promise<ChainComponent<any, any>> {
    const component = await fetch(`${window.localStorage.getItem('api-url')}/component/${token}`).then(r => r.json());

    throw `Unable to find component ${token}`;
}