import { useIsAuthenticated, useMsal } from '@azure/msal-react';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED_DOMAIN = (import.meta.env.VITE_ALLOWED_DOMAIN ?? '').trim();

export type AuthState = {
  isAuthenticated: boolean;
  isEmployee: boolean;
  isAdmin: boolean;
  email: string;
  login: () => void;
  logout: () => void;
};

export const useAuth = (): AuthState => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const account = accounts[0];
  const email =
    (account &&
      ((account.idTokenClaims as any)?.email || account.username)) ||
    '';

  const isEmployee =
    !!email && (ALLOWED_DOMAIN ? email.endsWith(ALLOWED_DOMAIN) : true);

  const isAdmin = isEmployee && ADMIN_EMAILS.includes(email);

  const login = () => {
    instance.loginRedirect({
      scopes: ['openid', 'profile', 'email'],
    });
  };

  const logout = () => {
    instance.logoutRedirect();
  };

  return {
    isAuthenticated,
    isEmployee,
    isAdmin,
    email,
    login,
    logout,
  };
};
