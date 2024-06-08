import { Auth0Provider } from '@auth0/auth0-react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const AUTH0_URL = import.meta.env.VITE_AUTH0_URL ?? ''
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={AUTH0_URL}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: `https://${AUTH0_URL}/api/v2/`,
    }}
    cacheLocation='localstorage'
  >
    <App />
  </Auth0Provider>
)
