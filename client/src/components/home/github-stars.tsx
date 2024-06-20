import { useEffect, useState } from 'react'
import LoginButton from '../auth/login-button'

export function GitHubStars() {
  const [starCounter, setStarCounter] = useState(0)

  useEffect(() => {
    async function fetchGitHubStars() {
      const response = await fetch(
        "https://api.github.com/repos/fraineralex/chatify"
      )

      const data = await response.json()

      setStarCounter(data.stargazers_count ?? 0)
    }

    fetchGitHubStars()
  }, [])

  function formatToK(num: number) {
    return num >= 1000
      ? (num / 1000).toFixed(1) + 'K'
      : num.toString()
  }

  return (
    <div className="absolute left-0 right-0 md:top-4 md:mr-4 md:justify-end mx-auto w-full flex justify-center">
      <a
        href="https://github.com/fraineralex/chatify"
        className="flex hover:scale-105 group transition cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className="flex h-8 w-8 items-center justify-center space-x-2 rounded-md border"
        >
          <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            >
            </path>
          </svg>
        </div>

        <div className="flex items-center">
          <div
            className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-gray-100 border-y-transparent group-hover:border-x-yellow-200"
          >
          </div>
          <div
            className="overflow-hidden flex flex-col h-8 items-center rounded-md bg-gray-100 px-4 font-medium text-xs justify-center group-hover:bg-yellow-200 transition w-40 relative"
          >
            <span className="absolute">
              {`${formatToK(starCounter)} stars on GitHub`}</span>
            <span className="absolute opacity-0 -translate-y-5 ">
              Give it a star!
            </span>
          </div>
        </div>
      </a>
      <LoginButton className='ms-2 px-3 py-1 border-2 border-blue-500 rounded-md bg-blue-500 hover:scale-105 hover:bg-blue-600 hover:border-blue-600 ease-in-out duration-300 text-white font-semibold text-sm'>
        Start Chatting
      </LoginButton>
    </div>
  )
}