import { Profile } from '../auth/profile'
import { HeaderButtons } from './header-buttons'

export function Header () {
  return (
    <header className='flex items-center justify-between px-3 py-3 border-b bg-gray-300 rounded-sm'>
      <Profile />
      <HeaderButtons />
    </header>
  )
}
