import React from 'react'
import { useState, useEffect, useRef } from 'react'

export function Dropdown ({
  children,
  Icon
}: {
  children: React.ReactNode
  Icon: React.ReactNode
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
        onClick={event => {
          event.stopPropagation()
          setDropdownOpen(!dropdownOpen)
        }}
        className={`${
          dropdownOpen ? 'inline' : 'hidden'
        } group-hover:inline-block ease-in-out duration-100 hover:scale-125`}
      >
        {Icon}
      </button>

      <div
        className={`z-10 ${
          dropdownOpen ? 'absolute' : 'hidden'
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
      >
        {children}
      </div>
    </div>
  )
}
