import {
  EllipsisVertical,
  MegaphoneOff,
  MessageSquareDot,
  SquarePlus,
  Archive,
  Lock,
  X,
  CircleAlert,
} from "lucide-react"
import Modal from "../common/modal"
import { useEffect, useState } from "react"
import { User } from "../../types/chat"
import { ChatItem } from "../chat/chat-item"
import { useAuth0 } from "@auth0/auth0-react"
import { useNewChatModalStore } from "../../store/newChatModal"
import { getAllUsers } from "../../services/user"
import { useSocketStore } from "../../store/socket"
import { Dropdown } from "../common/dropdown"
import { LogoutButton } from "../auth/logout-button"

export function HeaderButtons() {
  const { isOpen, closeModal, openModal } = useNewChatModalStore()
  const [users, setUsers] = useState<User[]>([])
  const { user: loggedUser, getAccessTokenSilently } = useAuth0()
  const [search, setSearch] = useState("")
  const { chats, setChatFilterState, chatFilterState } = useSocketStore()

  let filteredUsers = users.filter(
    (user) =>
      user.id !== loggedUser?.sub &&
      user.name.toLowerCase().includes(search.toLowerCase())
  )

  if (users.length === 0) filteredUsers = chats.map(chat => chat.user)

  const toggleBlockedChats = () => {
    chatFilterState === "blocked"
      ? setChatFilterState("all")
      : setChatFilterState("blocked")
  }

  const toggleArchivedChats = () => {
    chatFilterState === "archived"
      ? setChatFilterState("all")
      : setChatFilterState("archived")
  }

  const toggleMutedChats = () => {
    chatFilterState === "muted"
      ? setChatFilterState("all")
      : setChatFilterState("muted")
  }

  const toggleUnreadChats = () => {
    chatFilterState === "unread"
      ? setChatFilterState("all")
      : setChatFilterState("unread")
  }

  useEffect(() => {
    if (!isOpen ||(!isOpen && chats.length === 0)) return

    (async () => {
      const users = await getAllUsers(await getAccessTokenSilently())
      setUsers(() => users ?? [])
    })()
  }, [isOpen])

  return (
    <>
      <aside className="flex items-center justify-between px-3 py-2 flex-row-reverse text-gray-700 space-x-6 md:space-x-2 lg:space-x-5">
        <Dropdown
          Icon={<EllipsisVertical className="w-5 h-5" />}
          buttonClassName="hover:scale-110 hover:contrast-200 align-middle ps-6 md:ps-2 lg:ps-6"
          dropdownClassName="max-sm:right-3 mt-2"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <button
                className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle"
                title="Blocked Chats"
                aria-label="Blocked Chats"
                onClick={toggleBlockedChats}
              >
                <Lock className="w-5 h-5 inline me-2" /> Blocked Chats
              </button>
            </li>
            <li>
              <LogoutButton />
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/fraineralex/chatify"
                title="Settings"
                aria-label="Settings"
                className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle"
              >
                <CircleAlert className="w-5 h-5 inline me-2" /> About
              </a>
            </li>
          </ul>
        </Dropdown>
        <button
          title="New Chat"
          aria-label="New Chat"
          className={`hover:scale-110 hover:contrast-200 ${chats.length === 0
            ? "text-blue-700 animate-pulse duration-300 ease-in-out"
            : "text-gray-700"
            }`}
        >
          <SquarePlus className="w-5 h-5" onClick={openModal} />
        </button>
        <button
          className={`hover:scale-110 hover:contrast-200 ${chatFilterState === "unread" ? "text-blue-700" : "text-gray-700"
            }`}
          title="Unread Chats"
          aria-label="Unread Chats"
          onClick={toggleUnreadChats}
        >
          <MessageSquareDot className="w-5 h-5" />
        </button>
        <button
          className={`hover:scale-110 hover:contrast-200 ${chatFilterState === "archived" ? "text-blue-700" : "text-gray-700"
            }`}
          title="Hidden Chats"
          aria-label="Hidden Chats"
          onClick={toggleArchivedChats}
        >
          <Archive className="w-5 h-5" />
        </button>
        <button
          className={`hover:scale-110 hover:contrast-200 ${chatFilterState === "muted" ? "text-blue-700" : "text-gray-700"
            }`}
          title="Muted Chats"
          aria-label="Muted Chats"
          onClick={toggleMutedChats}
        >
          <MegaphoneOff className="w-5 h-5" />
        </button>
      </aside>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <article className="fixed md:left-60 top-0 mt-16 z-50 md:mx-2 max-w-full md:max-w-[400px] flex-col items-center overflow-hidden rounded-md px-4 pb-6 shadow-2xl border bg-gray-300 w-full md:w-3/4 md:max-h-50 max-h-full md:h-5/6 flex">
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-400 hover:scale-110"
            onClick={() => closeModal()}
          >
            <X className="w-4 h-4 text-gray-900" />
          </button>
          <h2 className="font-bold mb-4 text-center text-lg mt-3">New Chat</h2>
          <div className="relative mb-2 w-full md:mb-4">
            <input
              autoFocus
              type="text"
              className="font-medium w-full placeholder-gray-700 bg-transparent border outline-none disabled:bg-gray-500 text-gray-800 border-gray-600 focus:bg-gray-400 focus:border-gray-400 focus:border-2 rounded-xl px-3 py-1"
              placeholder="Start typing to search"
              onChange={({ target }) => setSearch(target.value)}
              value={search}
            />
          </div>
          <nav className="self-start w-full h-full overflow-y-auto scroll-smooth">
            <ul className="space-y-1 pb-14 md:pb-0">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <ChatItem key={index} user={user} isNewChat />
                ))
              ) : (
                <p className="text-center font-medium">
                  {search ? "Chat not found" : "No chats to show"}
                </p>
              )}
            </ul>
          </nav>
        </article>
      </Modal>
    </>
  )
}
