import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./app.js";
import { Auth0Provider } from "@auth0/auth0-react";

const root = createRoot(document.getElementById('root'));
root.render(
<Auth0Provider
    domain="dev-u6uwyno04e1echcf.us.auth0.com"
    clientId="7uEfh3lDsysMnvFQxtYhZAWUU9f0MMpy"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
    );
