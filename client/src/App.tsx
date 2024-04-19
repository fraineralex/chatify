import Home from './components/home'
import { ChatScreen } from './pages/chat'
import { useAuth0 } from '@auth0/auth0-react'
import { useSocketStore } from './store/socket'

function App () {
  const { isAuthenticated, isLoading, user } = useAuth0()
  const { socket, setSocket } = useSocketStore()

  if (isLoading) return <div>Loading...</div>

  if (isAuthenticated && user) {
    const newSocket = socket
    newSocket.auth = {
      ...newSocket.auth,
      user: user
    }

    setSocket(newSocket)
  }

  return <>{isAuthenticated ? <ChatScreen /> : <Home />}</>
}

export default App
