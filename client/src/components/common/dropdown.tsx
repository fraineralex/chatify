import React from 'react'
import { useState, useEffect, useRef } from 'react'

export function Dropdown ({
  children,
  Icon,
  buttonClassName,
  dropdownClassName
}: {
  children: React.ReactNode
  Icon: React.ReactNode
  buttonClassName?: string
  dropdownClassName?: string
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef}>
      <button
        title='Options'
        name='options'
        aria-label='Options'
        onClick={event => {
          event.stopPropagation()
          event.preventDefault()
          setDropdownOpen(!dropdownOpen)
        }}
        className={
          buttonClassName
            ? `${buttonClassName} ${dropdownOpen ? 'text-gray-900' : undefined}`
            : `${
                dropdownOpen ? 'inline text-gray-900' : 'hidden'
              } group-hover:inline-block ease-in-out duration-100 hover:scale-125`
        }
      >
        {Icon}
      </button>

      <div
        className={`z-10 ${
          dropdownOpen ? 'absolute' : 'hidden'
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ${dropdownClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
