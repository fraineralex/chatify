import { useAuth0 } from '@auth0/auth0-react'

export function Profile () {
  const { user } = useAuth0()
  const formatedName = user?.name?.split(' ').slice(0, 2).join(' ')

  return (
    <img
      title={user?.name}
      aria-label={user?.name}
      width='50'
      height='50'
      src={user?.picture}
      alt={`avatar of the user ${formatedName}`}
      className='w-10 h-10 rounded-full'
      style={{ aspectRatio: 50 / 50, objectFit: 'cover' }}
    />
  )
}
