import { useAuth0 } from '@auth0/auth0-react'
import { ReactNode } from 'react'

const LoginButton = ({ className, children }: { className: string, children: ReactNode }) => {
  const { loginWithRedirect } = useAuth0()

  return (
    <button
      className={className}
      onClick={() => loginWithRedirect()}
    >
      {children}
    </button>
  )
}

export default LoginButton
