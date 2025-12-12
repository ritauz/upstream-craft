import { getIdToken } from '../auth/getIdToken';

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getIdToken();

  const headers = new Headers(init.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');

  return fetch(input, {
    ...init,
    headers,
  });
}
