import Home from './components/home'
import { ChatScreen } from './pages/chat-screen'
import { useAuth0 } from '@auth0/auth0-react'

function App () {
  const { isAuthenticated, isLoading, user } = useAuth0()

  if (isLoading) return <div>Loading...</div>

  return <>{isAuthenticated && user ? <ChatScreen /> : <Home />}</>
}

export default App
