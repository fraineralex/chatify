import { useAuth0 } from '@auth0/auth0-react'
import { LogOut } from 'lucide-react'

const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      className='hover:scale-110 hover:contrast-200 text-gray-700 font-semibold text-sm px-2'
      title='Log out'
      aria-label='Log out'
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <LogOut className='w-5 h-5' />
    </button>
  )
}

export default LogoutButton
