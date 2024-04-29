import { Check, CheckCheck, Clock } from 'lucide-react'

export function MessageState ({
  isSent,
  isDelivered,
  isRead,
  isChatItem
}: {
  isSent: boolean
  isDelivered: boolean
  isRead: boolean
  isChatItem?: boolean
}) {
  let className = `w-4 h-4 inline ${isRead ? 'text-blue-500' : 'text-gray-500'}`

  if (isChatItem) className += ' text-[10px] ms-1 me-1'
  else className += ' float-end align-bottom text-[10px] mt-4 ms-2'

  return (
    <>
      {isSent ? (
        <>
          {!isDelivered && <Check className={className} />}
          {isDelivered && <CheckCheck className={className} />}
        </>
      ) : (
        <Clock className={className} />
      )}
    </>
  )
}
