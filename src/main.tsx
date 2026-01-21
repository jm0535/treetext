import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN || "dev-placeholder.auth0.com"}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || "placeholder-client-id"}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: 'openid profile email'
    }}
  >
    <App />
  </Auth0Provider>
);
