import { ChatItem as Props } from '../../types/chat'
import { useChatItem } from '../../hooks/useChatItem'
import { LastMessage } from './last-message'
import { LastMessageTime } from './last-message-time'

export function ChatItem({
  uuid,
  user,
  lastMessage,
  unreadMessages,
  isNewChat,
  isPinned,
  isUnread,
  cleaned,
  isMuted
}: Props) {
  const {
    handleOpenChat,
    isCurrentChat,
    loggedUser,
    chatExists,
    handleCreateChat
  } = useChatItem({
    uuid,
    user,
    unreadMessages,
    isNewChat,
    isUnread,
    isMuted
  })

  const lastMessageDate = new Date(lastMessage?.createdAt ?? 0)

  const isCleaned =
    lastMessageDate.getTime() <
    new Date(cleaned ?? 0)?.getTime()

  return (
    <li
      className={`flex items-center space-x-2 border border-transparent border-b-gray-300 cursor-pointer px-2 py-2 w-full group ${isCurrentChat
          ? 'bg-gray-300 rounded-md'
          : 'rounded-sm hover:bg-gray-200 hover:rounded-md bg-transparent'
        }`}
      onClick={chatExists ? handleOpenChat : handleCreateChat}
    >
      <img
        src={user.picture}
        width='50'
        height='50'
        alt={`Chat avatar of ${user.name}`}
        className={`rounded-full ${isNewChat ? 'w-9 h-9' : 'w-12 h-12'}`}
        style={{ aspectRatio: 50 / 50, objectFit: 'cover' }}
      />
      <article className='items-center text-left w-full overflow-hidden'>
        <div className='flex text-left flex-grow w-full justify-between'>
          <h2 className='text-base font-medium inline-flex items-center capitalize'>
            {user.name.split('@')[0].toLowerCase()}
          </h2>
          {!isNewChat && lastMessage && !isCleaned && (
            <LastMessageTime createdAt={lastMessageDate} />
          )}
        </div>
        {!isNewChat && (
          <LastMessage
            loggedUser={loggedUser}
            lastMessage={lastMessage}
            unreadMessages={isCurrentChat ? 0 : unreadMessages ?? 0}
            uuid={uuid}
            isPinned={isPinned}
            isUnread={isUnread}
            isMuted={isMuted}
            isCleaned={isCleaned}
          />
        )}
      </article>
    </li>
  )
}
