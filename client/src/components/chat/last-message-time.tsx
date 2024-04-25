export function LastMessageTime ({ createdAt }: { createdAt: Date }) {
  return (
    <time className='text-xs text-gray-500 text-right inline-flex mt-1'>
      {new Date(createdAt).toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}
    </time>
  )
}
