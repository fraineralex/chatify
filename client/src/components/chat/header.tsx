interface Props {
  name: string
  image: string
}

export function Header ({ name, image }: Props) {
  return (
    <header className='flex gap-2 border-b py-3'>
      <img
        src={image}
        width='40'
        height='40'
        alt={`Contact avatar of ${name}`}
        className='rounded-full'
        style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
      />
      <h2 className='text-base font-bold my-auto'>{name}</h2>
    </header>
  )
}
