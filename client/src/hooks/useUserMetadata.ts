import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useSocketStore } from '../store/socket'
import { toast } from 'sonner'

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? ''

export function useUserMetadata () {
  const { user, getAccessTokenSilently } = useAuth0()
  const { setUserMetadata } = useSocketStore()

  useEffect(() => {
    if (!user) return
    const getUserMetadata = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/users/metadata`, {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`
          }
        })
        if (response.status !== 200) {
          toast.error(
            'Something failed getting your data, refresh the page to try again'
          )
          return
        }

        const userMetadata = await response.json()
        setUserMetadata(userMetadata)
      } catch (e) {
        toast.error(
          'Something failed getting your data, refresh the page to try again'
        )
      }
    }

    getUserMetadata()
  }, [user?.sub])
}
