import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react';

import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './infrastructure/auth/msalClient';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
);
