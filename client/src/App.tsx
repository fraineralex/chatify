import { Toaster } from 'sonner'
import Home from './components/home'
import { ChatScreen } from './pages/chat-screen'
import { useAuth0 } from '@auth0/auth0-react'
import Loading from './components/layout/loading'

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0()

  if (isLoading) return <Loading />

  return <>
    <Toaster />
    {isAuthenticated && user ? <ChatScreen /> : <Home />}
  </>
}

export default App
