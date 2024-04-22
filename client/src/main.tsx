import { Auth0Provider } from '@auth0/auth0-react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN ?? ''
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin
      /* audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      scope: 'read:current_user update:current_user_metadata' */
    }}
  >
    <App />
  </Auth0Provider>
)
