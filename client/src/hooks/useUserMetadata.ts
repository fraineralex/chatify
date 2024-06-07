import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useSocketStore } from '../store/socket'

const domain = import.meta.env.VITE_SERVER_DOMAIN ?? ''

export function useUserMetadata () {
  const { user, getAccessTokenSilently } = useAuth0()
  const { setUserMetadata } = useSocketStore()

  useEffect(() => {
    if (!user) return
    const getUserMetadata = async () => {
      try {
        const response = await fetch(`${domain}/users/metadata`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`
          }
        
        })
        if (response.status !== 200) {
          console.log('Failed to get user metadata:', response.statusText)
          return
        }

        const userMetadata = await response.json()
        setUserMetadata(userMetadata)
      } catch (e) {
        console.log(e)
      }
    }

    getUserMetadata()
  }, [user?.sub])
}
