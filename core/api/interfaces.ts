import {ApiDocument} from "./resources";
import * as Response from './response';
import {ApiResponse_Success} from "./response";

// This is the API token used for the API.
export const authToken: string = document.cookie.match(/auth-token=([^;$]+)/)?.[1] ?? "";

if (authToken.length <= 0)
    throw `No auth token found. Using an anonymous session.`;

// This defines the host for the API endpoints. This allows local development versions under `localhost`. Note that IP-based access does not work, as you cannot use subdomains.
export const API = window.localStorage.getItem('api-url') ?? `${window.location.protocol}//api.${window.location.host}`;

console.log(API);

interface Handler extends Record<Response.Action, (...x: any[]) => Promise<any>> {
    [Response.Action.Document_Read](authToken: string, documentToken: string): Promise<ApiDocument>;
}

export const handlers: Partial<Handler> = {
    async [Response.Action.Document_Read](authToken: string, documentToken: string): Promise<ApiDocument> {
        return await fetch(`${API}/document/${documentToken}`, {
            method: 'GET',
            headers: {'auth-token': authToken}
        }).then(res => (!res.ok || 'error' in res) ?
            Promise.reject(res) :
            res.json() as Promise<ApiResponse_Success<ApiDocument, Response.Action.Document_Read>>)
            .then(res => res.data);
    },
    async [Response.Action.User_List_Own_Documents](authToken: string): Promise<ApiDocument[]> {
        return await fetch(`${API}/user/documents`, {
            method: 'GET',
            headers: {'auth-token': authToken}
        }).then(res => (!res.ok || 'error' in res) ?
            Promise.reject(res) :
            res.json() as Promise<ApiResponse_Success<ApiDocument[], Response.Action.User_List_Own_Documents>>)
            .then(res => res.data);
    }
};

export function query<T extends keyof Handler>(action: T, params: Parameters<Handler[T]>): Handler[T] {
    const handler = handlers[action];

    if (handler)
        return handler as Handler[T];
    else
        throw `No handler for action ${Response.Action[action]}`;
}