import { useAuth0 } from '@auth0/auth0-react'
import { LogOut } from 'lucide-react'
import { db } from '../../database/db'
import { toast } from 'sonner'

export function LogoutButton() {
  const { logout } = useAuth0()

  const handleClickLogout = async () => {
    try {
      logout({ logoutParams: { returnTo: window.location.origin } })
      await db.chats.clear()
      await db.messages.clear()
    } catch (error) {
      toast.error('Failed to logout, please try again later')
    }
  }

  return (
    <button
      title='Log out'
      aria-label='Log out'
      className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
      onClick={handleClickLogout}
    >
      <LogOut className='w-5 h-5 inline me-2' /> Log out
    </button>
  )
}
