import { useAuth0 } from '@auth0/auth0-react'
import { LogOut } from 'lucide-react'

export function Profile () {
  const { user, logout } = useAuth0()
  const formatedName = user?.name?.split(' ').slice(0, 2).join(' ')

  return (
    <footer
      title='Log out'
      aria-label='Log out'
      className='flex justify-between items-center p-3 align-bottom mx-2 rounded-md hover:bg-gray-200 group cursor-pointer'
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <figure className='flex justify-center items-center space-x-2 group-hover:space-x-3'>
        <img
          width='50'
          height='50'
          src={user?.picture}
          alt={`avatar of the user ${formatedName}`}
          className='w-10 h-10 rounded-full group-hover:scale-105 ease-in-out duration-300'
          style={{ aspectRatio: 50 / 50, objectFit: 'cover' }}
        />
        <figcaption className='text-gray-700 font-semibold text-sm group-hover:text-gray-900 group-hover:scale-105 ease-in-out duration-300'>
          {formatedName}
        </figcaption>
      </figure>
      <LogOut className='hidden group-hover:block ease-in-out duration-300 font-semibold text-sm text-gray-900' />
    </footer>
  )
}
