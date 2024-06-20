import { Check, CheckCheck, Clock } from 'lucide-react'

export function MessageState ({
  isSent,
  isDelivered,
  isRead,
  isChatItem
}: {
  isSent?: boolean
  isDelivered: boolean
  isRead: boolean
  isChatItem?: boolean
}) {
  let className = `w-4 h-4 inline ${isRead && 'text-blue-500'}`

  if (isChatItem) className += ' text-[10px] ms-1 me-1'
  else className += ' text-[10px]'

  return (
    <>
      {isSent && !isDelivered && <Check className={className} />}
      {isSent && isDelivered && <CheckCheck className={className} />}
      {!isSent && <Clock className={className} />}
    </>
  )
}
