import { Auth0Provider } from '@auth0/auth0-react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain='chatify-app.us.auth0.com'
    clientId='Z3GOlIbkpW5YIpZNSjyKXaHcDrH490g2'
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: `https://chatify-app.us.auth0.com/api/v2/`,
      scope: 'read:current_user update:current_user_metadata'
    }}
  >
    <App />
  </Auth0Provider>
)
