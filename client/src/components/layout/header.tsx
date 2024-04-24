import { Profile } from '../auth/profile'
import { GetUsersModal } from './get-users'

export function Header () {
  return (
    <header className='flex items-center justify-between px-3 py-3 border-b '>
      <Profile />
      <GetUsersModal />
    </header>
  )
}
