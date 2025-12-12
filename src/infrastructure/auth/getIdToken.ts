import { msalInstance } from './msalClient';

const SCOPES = ['openid', 'profile', 'email'];

export async function getIdToken(): Promise<string> {
  const accounts = msalInstance.getAllAccounts();
  const account = accounts[0];

  if (!account) {
    throw new Error('No signed-in account.');
  }

  const result = await msalInstance.acquireTokenSilent({
    scopes: SCOPES,
    account,
  });

  // IDトークンでもアクセストークンでもよいが、サーバ側の検証と揃える
  return result.idToken;
}
