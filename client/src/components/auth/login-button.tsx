import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <button
      className='px-3 py-2 mt-2 border-2 border-blue-500 rounded-md bg-blue-500 max-w-28 hover:scale-110 hover:bg-blue-600 hover:border-blue-600 ease-in-out duration-300 text-white font-semibold text-sm'
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  )
}

export default LoginButton
