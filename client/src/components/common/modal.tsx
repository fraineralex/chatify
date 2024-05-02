import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export default function Modal ({
  isOpen,
  onClose,
  children,
  className
}: ModalProps) {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <>
      <div className={`fixed inset-0 z-50 ${className}`} onClick={onClose} />
      {children}
    </>,
    document.body
  )
}
