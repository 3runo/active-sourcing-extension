import { compose } from 'lodash/fp';

type TFetchInit = RequestInit & { url: string };
type TDefineFetch = (url: string, token?: string, payload?: any) => TFetchInit;
type TFetch = (url: string, token?: string, payload?: any) => Promise<any>;
type TPromise = Promise<any>;

function toJson(response: Response) {
  return response.status === 204 ? '' : response.json();
}

function defineFetch(method?: string): TDefineFetch {
  return function make(url: string, token?: string, payload?: any): TFetchInit {
    return {
      url,
      body: payload != null ? JSON.stringify(payload) : undefined,
      method: typeof method === 'string' ? method : undefined,
      headers:
        token != null && token.trim().length > 0
          ? { Authorization: `Bearer ${token}` }
          : {},
    };
  };
}

function mergeFetchConfig({ url, headers, ...rest }: TFetchInit) {
  return fetch(`http://localhost:8080${url}`, {
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...headers },
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
    ...rest,
  }).then(toJson);
}

export function postSaveProfile(payload: Record<string, string>): TPromise {
  return postJson(`/profile`, '', payload)
    .then(console.log)
    .catch(console.error);
}

const postJson: TFetch = compose([mergeFetchConfig, defineFetch('POST')]);
const getJson: TFetch = compose([mergeFetchConfig, defineFetch('GET')]);
