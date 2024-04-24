interface Props {
  className?: string
}

export function Emoji ({ className }: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <circle cx='12' cy='12' r='10'></circle>
      <path d='M8 14s1.5 2 4 2 4-2 4-2'></path>
      <line x1='9' x2='9.01' y1='9' y2='9'></line>
      <line x1='15' x2='15.01' y1='9' y2='9'></line>
    </svg>
  )
}

export function AttachFile ({ className }: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <path d='m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48'></path>
    </svg>
  )
}

export function Send ({ className }: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      className={className}
    >
      <path d='m22 2-7 20-4-9-9-4Z'></path>
      <path d='M22 2 11 13'></path>
    </svg>
  )
}
