import type { Configuration } from '@azure/msal-browser';

const tenantId = import.meta.env.VITE_AAD_TENANT_ID;
const clientId = import.meta.env.VITE_AAD_CLIENT_ID;
const redirectUri = import.meta.env.VITE_AAD_REDIRECT_URI;

if (!tenantId || !clientId || !redirectUri) {
  // 起動時に気付きたいので、ここで落とす
  // 本番導入前に必ず env を埋めること
  throw new Error('MSAL config env is missing.');
}

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};
