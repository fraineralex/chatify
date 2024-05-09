import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { metadata } from '../types/user'

const domain = import.meta.env.VITE_AUTH0_DOMAIN ?? ''
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN ?? ''

const initialUserMetadata: metadata = {
  chat_preferences: {
    archived: [],
    cleaned: {},
    deleted: [],
    muted: [],
    pinned: []
  }
}

export function useUserMetadata () {
  const { user, getAccessTokenSilently } = useAuth0()
  const [userMetadata, setUserMetadata] =
    useState<metadata>(initialUserMetadata)

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: 'read:current_user'
          }
        })

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user?.sub}`

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        const { user_metadata } = await metadataResponse.json()

        setUserMetadata(user_metadata)
      } catch (e) {
        console.log(e)
      }
    }

    getUserMetadata()
  }, [getAccessTokenSilently, user?.sub])

  const updateUserMetadata = async (metadata: metadata) => {
    const data = await fetch(`${SERVER_DOMAIN}/users/${user?.sub}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ metadata })
    })

    if (data.status === 200) {
      setUserMetadata(metadata)
    }
  }

  return { userMetadata, updateUserMetadata }
}
